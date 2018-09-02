import Vue from 'vue'
import VTooltip from 'v-tooltip'

// Global Axios defaults

import axios from 'axios'
axios.defaults.timeout = 15000

// Global functions

if (!String.format) {
  String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1)
    return format.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] !== 'undefined'
        ? args[number]
        : match
    })
  }
}

// Global Vue settings

Vue.config.productionTip = false

// Global Vue components

Vue.use(VTooltip)

Vue.mixin({
  methods: {
    // @todo: placeholder translation method with a "gettext" signature (underscore fn)
    _: function (key, params) {
      if (typeof params !== 'undefined') {
        return String.format(key, ...params)
      }
      return key
    }
  }
})

addComponents([
  'Navigation',
])

/** Map component path into component name (Front/Header.vue -> <front-header>) */
function addComponents (components) {
  components.forEach(function (componentPath) {
    var name = componentPath.toLowerCase().replace('/', '-')
    Vue.component(name, component(componentPath))
  })
}

function component (name, resolve) {
  return function (resolve) {
    require(['./components/' + name + '.vue'], resolve)
  }
}
