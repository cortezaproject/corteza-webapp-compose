// Global Axios defaults
import axios from 'axios'
import alertMixin from '@/mixins/alert'
import prettyMixin from '@/mixins/pretty'
import BootstrapVue from 'bootstrap-vue'
import { PermissionsButton } from 'corteza-webapp-common/components'

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

// Global Vue plugins, mixins & components

Vue.use(VTooltip)
Vue.use(BootstrapVue)
Vue.mixin(alertMixin)
Vue.mixin(prettyMixin)
Vue.component('permissions-button', PermissionsButton)
