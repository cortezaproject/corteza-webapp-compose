import Vue from 'vue'

const bus = new Vue()

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
      bus.$emit('alert', alert)
    },

    defaultErrorHandler (prefix) {
      return (err = {}) => {
        this.raiseWarningAlert(err.message ? (this.$t(prefix) + ': ' + this.$t(err.message)) : this.$t(prefix))
      }
    },

    handleAlert (handler) {
      bus.$on('alert', handler)
    },
  },
}
