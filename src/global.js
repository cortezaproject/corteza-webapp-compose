// Global Axios defaults
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import VTooltip from 'v-tooltip'
import Vue from 'vue'
import './ui'

axios.defaults.timeout = 15000

// Global functions

if (!String.format) {
  String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1)
    return format.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match
    })
  }
}

// Global Vue settings

Vue.config.productionTip = false

// Global Vue components

Vue.use(VTooltip)
Vue.use(BootstrapVue)

Vue.mixin({
  data () {
    return {
      error: '',
    }
  },
  methods: {
    // @todo: placeholder translation method with a "gettext" signature (underscore fn)
    _: function (key, params) {
      if (typeof params !== 'undefined') {
        return String.format(key, ...params)
      }
      return key
    },
    clearError: function () {
      this.error = ''
    },
    showError: function (error) {
      this.error = error.toString()
    },
  },
})
