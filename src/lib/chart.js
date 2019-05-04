import _ from 'lodash'
import moment from 'moment'
import i18next from 'i18next'

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

export const chartTypes = [
  { text: 'line',
    value: 'line',
  },
  { text: 'bar',
    value: 'bar',
  },
]

export const aggregateFunctions = [
  { value: 'COUNTD',
    text: 'countd',
  },
  { value: 'SUM',
    text: 'sum',
  },
  { value: 'MAX',
    text: 'max',
  },
  { value: 'MIN',
    text: 'min',
  },
  { value: 'AVG',
    text: 'avg',
  },
  { value: 'STD',
    text: 'std',
  },
]

export const dimensionFunctions = [
  { text: 'none',
    value: '(no grouping / buckets)',
    convert: (f) => f,
    time: false,
  },

  { text: 'date',
    value: 'DATE',
    convert: (f) => `DATE(${f})`,
    time: { unit: 'day', minUnit: 'day', round: true },
  },

  { text: 'week',
    value: 'WEEK',
    convert: (f) => `DATE(${f})`,
    time: { unit: 'week', minUnit: 'week', round: true, isoWeekday: true },
  },

  { text: 'month',
    value: 'MONTH',
    convert: (f) => `DATE_FORMAT(${f}, '%Y-%m-01')`,
    time: { unit: 'month', minUnit: 'month', round: true },
  },

  { text: 'quarter', // fetch monthly aggregation but tell renderer to group by quarter
    value: 'QUARTER',
    convert: (f) => `DATE_FORMAT(${f}, '%Y-%m-01')`,
    time: { unit: 'quarter', minUnit: 'quarter', round: true },
  },

  { text: 'year',
    value: 'YEAR',
    convert: (f) => `DATE_FORMAT(${f}, '%Y-01-01')`,
    time: { unit: 'year', minUnit: 'year', round: true },
  },
]

export const predefinedFilters = [
  { value: `YEAR(created_at) = YEAR(NOW())`,
    text: `recordsCreatedThisYear` },
  { value: `YEAR(created_at) = YEAR(NOW()) - 1`,
    text: `recordsCreatedLastYear` },

  { value: `YEAR(created_at) = YEAR(NOW()) AND QUARTER(created_at) = QUARTER(NOW())`,
    text: `recordsCreatedThisQuarter` },
  { value: `YEAR(created_at) = YEAR(NOW()) - 1 AND QUARTER(created_at) = QUARTER(DATE_SUB(NOW(), INTERVAL 3 MONTH)`,
    text: `recordsCreatedLastQuarter` },

  { value: `DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')`,
    text: `recordsCreatedThisMonth` },
  { value: `DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 YEAR), '%Y-%m')`,
    text: `recordsCreatedLastMonth` },
]

dimensionFunctions.lookup = (d) => dimensionFunctions.find(f => d.modifier === f.value)
dimensionFunctions.convert = (d) => (dimensionFunctions.lookup(d) || {}).convert(d.field)

// Makes a standarised alias from modifier or dimension report option
const makeAlias = ({ alias, aggregate, modifier, field }) => alias || `${aggregate || modifier || 'none'}_${field}`

export default class Chart {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ chartID, namespaceID, name, config }) {
    this.chartID = typeof chartID === 'string' ? chartID : this.chartID || null
    this.namespaceID = typeof namespaceID === 'string' ? namespaceID : this.namespaceID || ''
    this.name = typeof name === 'string' ? name : this.name || ''

    if (typeof config === 'object') {
      // Verify & normalize
      let { renderer, reports } = config

      if (renderer) {
        let { version } = renderer || {}

        if (version !== 'chart.js') {
          throw Error(i18next.t('notification.chart.unsupportedRenderer', { version }))
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
        console.debug('Invalid chart config: moduleID not set')
        return false
      }

      // Expecting all dimensions to have defined fields
      if (!stdListCheck(dimensions.map(dimCheck))) {
        console.debug('Invalid chart config: no dimensions')
        return false
      }

      // Expecting all metrics to have defined fields
      if (!stdListCheck(metrics.map(mtrCheck))) {
        console.debug('Invalid chart config: no metrics')
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

      options.scales.xAxes = r.dimensions.map((d, i) => {
        const ticks = {
          autoSkip: !!d.autoSkip,
        }
        const timeDimensionUnit = (dimensionFunctions.lookup(d) || {}).time

        if (timeDimensionUnit) {
          return {
            type: 'time',
            time: timeDimensionUnit,
            ticks,
          }
        } else {
          return {
            ticks,
          }
        }
      })

      options.scales.yAxes = r.metrics.map((m, i) => {
        return {
          id: `y-axis-metric-${makeAlias(m)}`,
          type: m.axisType || 'linear',
          position: m.axisPosition || 'left',
          scaleLabel: {
            display: true,
            labelString: m.label || m.field,
          },
          ticks: {
            beginAtZero: !!m.beginAtZero,
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
          lineTension: 0,
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

    // Wait for all requests to finish and return new promise, with results
    return Promise.all(reports).then(() => new Promise(resolve => {
      // @todo this does not really support multiple reports per chart (hence the out[0]
      //       if we want to support that, label & data sync across all reports needs to be
      resolve(out[0])
    }))
  }

  formatReporterParams ({ moduleID, metrics, dimensions, filter }) {
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
    const dLabel = 'dimension_0'
    const { dimensions: [ dimension ] = [] } = report
    const isTimeDimension = !!(dimensionFunctions.lookup(dimension) || {}).time
    const getLabel = (rLabel, { default: dDft }) => {
      if (rLabel) return rLabel
      if (dDft) return dDft
      return rLabel
    }
    let labels = []

    // Skip missing values; if so requested
    if (dimension.skipMissing) {
      results = results.filter(r => r[dLabel] !== null)
    }

    if (!isTimeDimension) {
      // Not a time dimensions, build set of labels
      labels = results.map(r => getLabel(r[dLabel], dimension))
    }

    let metrics = report.metrics.map(({ field, fill, aggregate, label, type, backgroundColor }) => {
      const alias = makeAlias({ field, aggregate })

      return results.map(r => {
        const y = r[field === 'count' ? field : alias]
        if (!isTimeDimension) {
          // Return a set of integers
          return getLabel(y, dimension)
        }

        // Return objects {y,t}
        return { y, t: moment(getLabel(r[dLabel], dimension)).toDate() }
      })
    }) || []

    return { labels, metrics }
  }
}
