import _ from 'lodash'
import moment from 'moment'

const defDimension = () => Object.assign({}, { conditions: {} })
const defMetrics = () => Object.assign({}, {})

const defReport = () => Object.assign({}, {
  moduleID: null,
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

  formatReporterParams ({ moduleID, metrics, dimensions }) {
    return {
      moduleID,

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
      // Not a time timensions, build set of labels
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
