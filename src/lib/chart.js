import _ from 'lodash'

const defConfig = {
  reports: [{ moduleID: null, dimensions: [{}], metrics: [{}] }],
  renderer: {
    version: 'chart.js',
    type: 'bar',
    options: {},
    // options: {
    //   scales: {
    //     yAxes: [{
    //       ticks: {
    //         beginAtZero: true,
    //       },
    //     }],
    //   },
    // },
  },
}

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

    this.config = (config ? _.merge(defConfig, config) : false) || this.config || Object.assign({}, defConfig)
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
      // @todo this does not really support multiple reports per graph
      //       if we want to support that, label&data sync across all reports needs to be done
      resolve(data[0])
    })
  }

  formatReporterParams ({ moduleID, metrics, dimensions }) {
    return {
      moduleID,

      // Remove count (we'll get it anyway) and construct FUNC(ARG) params
      metrics: metrics.filter((f) => f.field !== 'count').map((m, i) => `${m.aggregate || 'none'}_${m.field}:${m.function}(${m.field})`).join(','),

      // Construct dimensions \w modifiers...
      dimensions: dimensions.map(d => d.modifier ? `${d.field}|${d.modifier}` : d.field)[0],
    }
  }

  processReporterResults (results, report) {
    return {
      // Map dimension data to labels
      labels: results.map(r => r['dimension_0']),

      // ... and metrics to datasets
      datasets: report.metrics.map(({ field, aggregate, label, type, backgroundColor }, index) => {
        return {
          label,
          type,
          backgroundColor,
          data: results.map(r => r[field === 'count' ? field : `${aggregate || 'none'}_${field}`]),
        }
      }),
    }
  }
}
