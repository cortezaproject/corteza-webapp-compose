const success = {
  variant: 'success',
  options: {
    'auto-hide-delay': 5000,
    'no-auto-hide': false,
  },
  payload: {
    title: 'Success',
  },
  actions: {},
}
const warning = {
  variant: 'warning',
  options: {
    'auto-hide-delay': 120000,
    'no-auto-hide': false,
  },
  payload: {
    title: 'Warning',
  },
  actions: {},
}

export default {
  methods: {
    raiseSuccessAlert (text, title = this.$t('toaster.successTitle')) {
      const w = {
        ...success,
        id: `${new Date().getTime()}`,
        options: {
          ...success.options,
          notes: text,
        },
        payload: {
          ...success.payload,
          notes: text,
          title,
        },
      }

      this.raiseAlert(w)
    },

    raiseWarningAlert (text, title = this.$t('toaster.warningTitle')) {
      const w = {
        ...warning,
        id: `${new Date().getTime()}`,
        options: {
          ...warning.options,
        },
        payload: {
          ...warning.payload,
          notes: text,
          title,
        },
      }

      this.raiseAlert(w)
    },

    raiseAlert (alert = {}) {
      this.$root.$emit('notification.show', alert)
    },

    defaultErrorHandler (prefix) {
      return (err = {}) => {
        /* eslint-disable no-console */
        console.error(err)
        this.raiseWarningAlert(err.message ? (prefix + ': ' + this.$t(err.message)) : prefix)
      }
    },

    handleAlert (handler) {
      this.$root.$on('notification.show', handler)
    },
  },
}
