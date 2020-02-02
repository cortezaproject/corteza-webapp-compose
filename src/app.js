import Vue from 'vue'

import './config-check'
import './console-splash'

import './plugins'
import './mixins'
import './components'

import i18n from './i18n'
import store from './store'
import router from './router'

import { compose } from '@cortezaproject/corteza-js'
import { mixins } from '@cortezaproject/corteza-vue'

export default (options = {}) => {
  options = {
    el: '#app',
    name: 'compose',
    template: '<router-view v-if="loaded"/>',

    mixins: [
      mixins.corredor,
    ],

    data: () => ({ loaded: false }),
    created () {
      this.$ComposeAPI.automationList()
        .then(this.makeAutomationScriptsRegistrator(this.$ComposeAPI, compose.TriggerComposeScriptOnManual))

      this.$Settings.init({ api: this.$ComposeAPI }).finally(() => {
        this.loaded = true
      })
    },
    router,
    store,
    i18n: i18n(),

    // Any additional options we want to merge
    ...options,
  }

  return new Vue(options)
}
