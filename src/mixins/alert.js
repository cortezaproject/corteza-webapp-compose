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
      this.$root.$emit('alert', alert)
    },

    defaultErrorHandler (prefix) {
      return (err = {}) => {
        /* eslint-disable no-console */
        err = err.message ? (prefix + ': ' + this.$t(err.message)) : prefix
        console.error(err)
        this.raiseWarningAlert(err)
      }
    },

    handleAlert (handler) {
      this.$root.$on('alert', handler)
    },
  },
}
