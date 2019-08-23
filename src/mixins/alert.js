const success = { variant: 'success', countdown: 5 }
const warning = { variant: 'warning', countdown: 120 }

export default {
  methods: {
    raiseSuccessAlert (message) {
      this.raiseAlert(Object.assign({}, success, { message: this.$t(message) }))
    },

    raiseWarningAlert (message) {
      this.raiseAlert(Object.assign({}, warning, { message }))
    },

    raiseAlert (alert = {}) {
      this.$root.$emit('alert', alert)
    },

    defaultErrorHandler (prefix) {
      return (err = {}) => {
        console.error(err)
        this.raiseWarningAlert(err.message ? (this.$t(prefix) + ': ' + this.$t(err.message)) : this.$t(prefix))
      }
    },

    handleAlert (handler) {
      this.$root.$on('alert', handler)
    },
  },
}
