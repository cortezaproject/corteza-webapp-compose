import './config-check'
import './console-splash'

import registerPlugins from './plugins'
import registerGlobalMixins from './mixins'
import registerGlobalComponents from './components'

import i18n from './i18n'
import store from './store'
import router from './router'
import './themes'

export default (Vue, options = {}) => {
  registerPlugins(Vue)
  registerGlobalMixins(Vue)
  registerGlobalComponents(Vue)

  options = {
    el: '#app',
    name: 'compose',
    template: '<div id="compose" class="h-100"><router-view class="view" /></div>',

    router,
    store: store(Vue),
    i18n: i18n(Vue),

    // Any additional options we want to merge
    ...options,
  }

  return new Vue(options)
}
