import Vue from 'vue'
import { createLocalVue, shallowMount as sm, mount as rm } from '@vue/test-utils'
import alertMixin from 'corteza-webapp-compose/src/mixins/alert'

Vue.config.ignoredElements = [
  'font-awesome-icon',
  // Ignore all bootstrap elements
  /^b-/,
]

export const writeableWindowLocation = ({ path: value = '/' } = {}) => Object.defineProperty(window, 'location', { writable: true, value })

export const mount = (component, params = {}) => shallowMount(component, { ...params })

const mounter = (component, { localVue, mocks = {}, stubs = [], ...options } = {}, mount) => {
  localVue = localVue || createLocalVue()
  return mount(component, {
    localVue,
    stubs: ['router-view', 'router-link', ...stubs],
    mixins: [ alertMixin ],
    directives: {
      'b-tooltip': () => {},
      'b-popover': () => {},
    },
    mocks: {
      $t: (e) => e,
      $SystemAPI: {},
      $ComposeAPI: {},
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
