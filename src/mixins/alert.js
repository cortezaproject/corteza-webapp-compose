import Vue from 'vue'

const bus = new Vue()

const success = { variant: 'success', countdown: 5 }
const warning = { variant: 'warning', countdown: 120 }

export default {
  methods: {
    raiseSuccessAlert (message) {
      this.raiseAlert(Object.assign({}, success, { message }))
    },

    raiseWarningAlert (message) {
      this.raiseAlert(Object.assign({}, warning, { message }))
    },

    raiseAlert (alert = {}) {
      bus.$emit('alert', alert)
    },

    defaultErrorHandler (prefix) {
      return (err = {}) => {
        this.$logger.error(err)
        this.raiseWarningAlert(err.message ? (prefix + ': ' + err.message) : prefix)
      }
    },

    handleAlert (handler) {
      bus.$on('alert', handler)
    },
  },
}
