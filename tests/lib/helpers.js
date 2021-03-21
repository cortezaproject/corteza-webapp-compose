import Vue from 'vue'
import { createLocalVue, shallowMount as sm, mount as rm } from '@vue/test-utils'
import toastMixin from 'corteza-webapp-compose/src/mixins/toast'
// import { plugins } from '@cortezaproject/corteza-vue'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'

Vue.config.ignoredElements = [
  'font-awesome-icon',
]

Vue.use(BootstrapVue)

export const writeableWindowLocation = ({ path: value = '/' } = {}) => Object.defineProperty(window, 'location', { writable: true, value })

export const mount = (component, params = {}) => shallowMount(component, { ...params })

const mounter = (component, { localVue, mocks = {}, stubs = [], ...options } = {}, mount) => {
  localVue = localVue || createLocalVue()
  return mount(component, {
    localVue,
    stubs: ['router-view', 'router-link', ...stubs],
    mixins: [toastMixin],
    directives: {
      'b-tooltip': () => {},
      'b-popover': () => {},
    },
    mocks: {
      $t: (e) => e,
      $SystemAPI: {},
      $ComposeAPI: {},
      // $Settings: plugins.Settings(),
      $s: sinon.stub().resolves(undefined),
      $route: { query: { fullPath: '', token: undefined } },
      ...mocks,
    },
    ...options,
  })
}

export const shallowMount = (...e) => {
  return mounter(...e, sm)
}

export const fullMount = (...e) => {
  return mounter(...e, rm)
}

export default shallowMount
