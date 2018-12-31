import _ from 'lodash'
import moment from 'moment'

const defDimension = () => Object.assign({}, { conditions: {} })
const defMetrics = () => Object.assign({}, {})

const defReport = () => Object.assign({}, {
  moduleID: null,
  filter: null,
  dimensions: [defDimension()],
  metrics: [defMetrics()],
})

const defConfig = () => Object.assign({}, {
  reports: [defReport()],
  renderer: {
    version: 'chart.js',
  },
})

export const dimensionFunctions = [
  { label: '',
    convert: (f) => f,
    time: false,
  },

  { label: 'DATE',
    convert: (f) => `DATE(${f})`,
    time: { unit: 'date', minUnit: 'day', round: true },
  },

  { label: 'WEEK',
    convert: (f) => `DATE(${f})`,
    time: { unit: 'week', minUnit: 'week', round: true, isoWeekday: true },
  },

  { label: 'MONTH',
    convert: (f) => `DATE_FORMAT(${f}, '%Y-%m-01')`,
    time: { unit: 'month', minUnit: 'month', round: true },
  },

  { label: 'QUARTER', // fetch monthly aggregation but tell renderer to group by quarter
    convert: (f) => `DATE_FORMAT(${f}, '%Y-%m-01')`,
    time: { unit: 'quarter', minUnit: 'quarter', round: true },
  },

  { label: 'YEAR',
    convert: (f) => `DATE_FORMAT(${f}, '%Y-01-01')`,
    time: { unit: 'year', minUnit: 'year', round: true },
  },
]

export const predefinedFilters = [
  { value: `YEAR(created_at) = YEAR(NOW())`,
    text: `Records created this year` },
  { value: `YEAR(created_at) = YEAR(NOW()) - 1`,
    text: `Records created last year` },

  { value: `YEAR(created_at) = YEAR(NOW()) AND QUARTER(created_at) = QUARTER(NOW())`,
    text: `Records created this quarter` },
  { value: `YEAR(created_at) = YEAR(NOW()) - 1 AND QUARTER(created_at) = QUARTER(DATE_SUB(NOW(), INTERVAL 3 MONTH)`,
    text: `Records created last quarter` },

  { value: `DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')`,
    text: `Records created this month` },
  { value: `DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 YEAR), '%Y-%m')`,
    text: `Records created last month` },
]

// message: "Can not execute report query (
// SELECT (COUNT(*)) AS count, (CAST(STD(JSON_UNQUOTE(JSON_EXTRACT(json, REPLACE(JSON_UNQUOTE(JSON_SEARCH(json, 'one', ?)), '.name', '.value')))) AS DECIMAL(14,2))) AS STD_value,
//                             (DATE_FORMAT(JSON_UNQUOTE(JSON_EXTRACT(json, REPLACE(JSON_UNQUOTE(JSON_SEARCH(json, 'one', ?)), '.name', '.value'))), ?)) AS dimension_0
//                        FROM crm_record WHERE module_id = ?
//                          AND YEAR(created_at) = YEAR(NOW()) - 1
//                          AND QUARTER(created_at) = QUARTER(DATE_SUB(NOW(), JSON_UNQUOTE(JSON_EXTRACT(json, REPLACE(JSON_UNQUOTE(JSON_SEARCH(json, 'one', ?)), '.name', '.value'))), 3, JSON_UNQUOTE(JSON_EXTRACT(json, REPLACE(JSON_UNQUOTE(JSON_SEARCH(json, 'one', ?)), '.name', '.value'))))) GROUP BY dimension_0 ORDER BY dimension_0): Error 1064: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'JSON_UNQUOTE(JSON_EXTRACT(json, REPLACE(JSON_UNQUOTE(JSON_SEARCH(json, 'one', ?)' at line 1"

dimensionFunctions.lookup = (d) => dimensionFunctions.find(f => d.modifier === f.label)
dimensionFunctions.convert = (d) => (dimensionFunctions.lookup(d) || {}).convert(d.field)

// Makes a standarised alias from modifier or dimension report option
const makeAlias = ({ alias, aggregate, modifier, field }) => alias || `${aggregate || modifier || 'none'}_${field}`

export default class Chart {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ chartID, name, config }) {
    this.chartID = typeof chartID === 'string' ? chartID : this.chartID || null
    this.name = typeof name === 'string' ? name : this.name || ''

    if (typeof config === 'object') {
      // Verify & normalize
      let { renderer, reports } = config

      if (renderer) {
        let { version } = renderer || {}

        if (version !== 'chart.js') {
          throw Error(`Unsupported renderer: ${version}`)
        }
      } else {
        renderer = { version: 'chart.js' }
      }

      config = { renderer, reports: reports || [] }
    }

    this.config = (config ? _.merge(defConfig(), config) : false) || this.config || defConfig()
  }

  // Static validation of reports (metrics, dimensions, fields set)
  isValid () {
    const stdListCheck = (list) => list.length > 0 && list.every(i => !!i)
    const dimCheck = ({ field }) => !!field
    const mtrCheck = ({ field, aggregate }) => (!!field && (field === 'count' || !!aggregate))

    return stdListCheck(this.config.reports.map(({ moduleID, dimensions, metrics }) => {
      if (!moduleID) {
        console.warn('Invalid chart config: moduleID not set')
        return false
      }

      // Expecting all dimensions to have defined fields
      if (!stdListCheck(dimensions.map(dimCheck))) {
        console.warn('Invalid chart config: no dimensions')
        return false
      }

      // Expecting all metrics to have defined fields
      if (!stdListCheck(metrics.map(mtrCheck))) {
        console.warn('Invalid chart config: no metrics')
        return false
      }

      return true
    }))
  }

  // Builds renderer (only ChartJS supported) options
  buildOptions () {
    let options = {
      animation: false,
    }

    let datasets = []

    this.config.reports.forEach(r => {
      if (!options.scales) options.scales = { xAxes: [], yAxes: [] }
      const timeDimensionUnit = (dimensionFunctions.lookup(r.dimensions[0]) || {}).time
      if (timeDimensionUnit) {
        options.scales.xAxes = [{
          type: 'time',
          time: timeDimensionUnit,
        }]
      }

      options.scales.yAxes = r.metrics.map((m, i) => {
        return {
          id: `y-axis-metric-${makeAlias(m)}`,
          type: m.axisType || 'linear',
          position: m.axisPosition || 'left',
          scaleLabel: {
            display: true,
            labelString: m.label || m.field,
          },
        }
      })

      datasets.push(...r.metrics.map(({ field, fill, aggregate, label, type, backgroundColor }) => {
        const alias = makeAlias({ field, aggregate })

        if (typeof backgroundColor === 'string') {
          const c = backgroundColor
          const o = 0.7
          backgroundColor = 'rgba(' + parseInt(c.slice(-6, -4), 16) + ',' + parseInt(c.slice(-4, -2), 16) + ',' + parseInt(c.slice(-2), 16) + ',' + o + ')'
        }

        fill = !!fill
        if (!label) label = field

        return {
          yAxisID: `y-axis-metric-${alias}`,
          label,
          type,
          fill,
          backgroundColor,
        }
      }))
    })

    return { type: 'bar', options, data: { datasets } }
  }

  async fetchReports ({ reporter }) {
    var out = []

    const reports = this.config.reports
      // Prepare params & filter out invalid combos (formatReporterParams will return null on invalid params)
      .map(this.formatReporterParams)

      // Send requests to reporter (API caller)
      .map(params => reporter(params))

      // Process each result
      .map((p, index) => p.then((results) => { out[index] = this.processReporterResults(results, this.config.reports[index]) }))

    // Wait for all requests to finish
    await Promise.all(reports)

    // Then return a new promise, with results
    return new Promise(resolve => {
      // @todo this does not really support multiple reports per chart (hence the out[0]
      //       if we want to support that, label & data sync across all reports needs to be done
      resolve(out[0])
    })
  }

  formatReporterParams ({ moduleID, metrics, dimensions, filter }) {
    console.log('Filter', filter)
    return {
      moduleID,
      filter,

      // Remove count (we'll get it anyway) and construct FUNC(ARG) params
      metrics: metrics.filter((f) => f.field !== 'count').map((m, i) => `${m.aggregate}(${m.field}) AS ${makeAlias(m)}`).join(','),

      // Construct dimensions \w modifiers...
      dimensions: dimensions.map(dimensionFunctions.convert)[0],
    }
  }

  processReporterResults (results, report) {
    let labels = []
    const isTimeDimension = !!(dimensionFunctions.lookup(report.dimensions[0]) || {}).time

    if (!isTimeDimension) {
      // Not a time dimensions, build set of labels
      labels = results.map(r => r['dimension_0'])
    }

    let metrics = report.metrics.map(({ field, fill, aggregate, label, type, backgroundColor }) => {
      const alias = makeAlias({ field, aggregate })

      return results.map(r => {
        const y = r[field === 'count' ? field : alias]
        if (!isTimeDimension) {
          // Return a set of integers
          return y
        }

        // Return objects {y,t}
        return { y, t: moment(r['dimension_0']).toDate() }
      })
    }) || []

    return { labels, metrics }
  }
}
