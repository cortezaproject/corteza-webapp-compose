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
    type: 'bar',
    options: {
      animation: false,
    },
  },
})

export const dimensionFunctions = [
  { label: '',
    convert: (f) => f,
    time: false },
  { label: 'DATE',
    convert: (f) => `DATE(${f})`,
    time: 'date' },
  { label: 'WEEK',
    convert: (f) => `DATE(${f})`,
    time: 'week' },
  { label: 'MONTH',
    convert: (f) => `DATE_FORMAT(${f}, '%Y-%m-01')`,
    time: 'month' },
  { label: 'QUARTER', // fetch monthly aggregation but tell renderer to group by quarter
    convert: (f) => `DATE_FORMAT(${f}, '%Y-%m-01')`,
    time: 'quarter' },
  { label: 'YEAR',
    convert: (f) => `DATE_FORMAT(${f}, '%Y-01-01')`,
    time: 'year' },
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
    if (this.config.reports.length === 0) {
      return false
    }

    const stdListCheck = (list) => {
      return list.length > 0 && list.every(i => !!i)
    }

    const dimCheck = ({ field }) => !!field

    const mtrCheck = ({ field, aggregate }) => (!!field && (field === 'count' || !!aggregate))

    return stdListCheck(this.config.reports.map(({ moduleID, dimensions, metrics }) => {
      if (!moduleID) {
        return false
      }

      // Expecting all dimensions to have defined fields
      if (!stdListCheck(dimensions.map(dimCheck))) {
        return false
      }

      // Expecting all metrics to have defined fields
      if (!stdListCheck(metrics.map(mtrCheck))) {
        return false
      }

      return true
    }))
  }

  async fetchReports ({ reporter }) {
    var data = []

    const reports = this.config.reports
      // Prepare params & filter out invalid combos (formatReporterParams will return null on invalid params)
      .map(this.formatReporterParams)

      // Send requests to reporter (API caller)
      .map(params => reporter(params))

      // Process each result
      .map((p, index) => p.then((results) => { data[index] = this.processReporterResults(results, this.config.reports[index]) }))

    // Wait for all requests to finish
    await Promise.all(reports)

    // Then return a new promise, with results
    return new Promise(resolve => {
      let options = this.config.renderer.options
      this.config.reports.forEach(r => {
        if (!options.scales) options.scales = { xAxes: [], yAxes: [] }
        const timeDimensionUnit = (dimensionFunctions.lookup(r.dimensions[0]) || {}).time
        if (timeDimensionUnit) {
          options.scales.xAxes = [{ type: 'time', time: { unit: timeDimensionUnit } }]
        }

        options.scales.yAxes = r.metrics.map((m, i) => {
          return {
            id: `y-axis-metric-${makeAlias(m)}`,
            type: m.axisType || 'linear',
            position: m.axisPosition || 'left',
            scaleLabel: {
              display: true,
              labelString: m.label,
            },
          }
        })
      })

      // @todo this does not really support multiple reports per chart (hence the data[0]
      //       if we want to support that, label&data sync across all reports needs to be done
      resolve({ data: data[0], options })
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
    const isTimeDimension = !!(dimensionFunctions.lookup(report.dimensions[0]) || {}).time
    let labels = []

    if (!isTimeDimension) {
      labels = results.map(r => r['dimension_0'])
    }

    return {
      // Map dimension data to labels
      labels,

      // ... and metrics to datasets
      datasets: this.generateDataSets(results, report),
    }
  }

  generateDataSets (results, report) {
    const isTimeDimension = !!(dimensionFunctions.lookup(report.dimensions[0]) || {}).time

    return report.metrics.map(({ field, fill, aggregate, label, type, backgroundColor }, index) => {
      const alias = makeAlias({ field, aggregate })

      if (typeof backgroundColor === 'string') {
        const c = backgroundColor
        const o = 0.7
        backgroundColor = 'rgba(' + parseInt(c.slice(-6, -4), 16) + ',' + parseInt(c.slice(-4, -2), 16) + ',' + parseInt(c.slice(-2), 16) + ',' + o + ')'
      }

      fill = !!fill

      return {
        yAxisID: `y-axis-metric-${alias}`,

        label,
        type,
        fill,
        backgroundColor,
        data: results.map(r => {
          let d = { y: r[field === 'count' ? field : alias] }
          if (isTimeDimension) d.t = moment(r['dimension_0']).toDate()
          return d
        }),
      }
    })
  }
}
