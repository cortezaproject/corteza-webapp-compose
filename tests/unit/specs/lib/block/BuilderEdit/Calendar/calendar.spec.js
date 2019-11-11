/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import { shallowMount, fullMount } from 'corteza-webapp-compose/tests/lib/helpers'
import { createLocalVue } from '@vue/test-utils'

import CalendarComponent from 'corteza-webapp-compose/src/lib/block/BuilderEdit/Calendar'
import FeedComponent from 'corteza-webapp-compose/src/lib/block/BuilderEdit/Calendar/feed'
import { Calendar } from 'corteza-webapp-compose/src/lib/block/Calendar'
import { module as ModuleComponent, reminder as ReminderComponent } from 'corteza-webapp-compose/src/lib/block/BuilderEdit/Calendar/feed/loader'

import Feed from 'corteza-webapp-compose/src/lib/block/Calendar/feed'
import Module from 'corteza-webapp-compose/src/lib/module'
import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'
import { resources } from 'corteza-webapp-compose/src/lib/block/Calendar'

import Vuex from 'vuex'
import sinon from 'sinon'
import fp from 'flush-promises'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('src/lib/block/BuilderEdit/Calendar', () => {
  afterEach(() => {
    sinon.restore()
  })

  let propsData
  beforeEach(() => {
    propsData = {
      namespace: new Namespace({ namespaceID: '1001' }),
      page: { pageID: '2001' },
      options: new Calendar({ defaultView: 'dayGridMonth' }),
    }
  })

  const mountCalendar = (opt) => shallowMount(CalendarComponent, {
    mocks: {},
    propsData,
    ...opt,
  })

  const fmCalendar = (opt) => fullMount(CalendarComponent, {
    mocks: {},
    propsData,
    ...opt,
  })

  describe('feed rendering', () => {
    it('should be able to show a set of fields', async () => {
      const tests = [
        {
          name: 'module feed',
          feeds: [
            new Feed({ resource: resources.module, options: { moduleID: '0001' } }),
            new Feed({ resource: resources.module, options: { moduleID: '0002' } }),
          ],
          modules: {
            module: {
              namespaced: true,
              state: {},
              getters: {
                set: () => [ new Module({ moduleID: '0001', fields: [] }) ],
              },
            },
          },

          expect: function (wrap) {
            expect(wrap.findAll(ModuleComponent)).to.have.length(2)
          },
        },

        {
          name: 'reminder feed',
          feeds: [
            new Feed({ resource: resources.reminder }),
            new Feed({ resource: resources.reminder }),
          ],
          modules: {
            module: {
              namespaced: true,
              state: {},
              getters: {
                set: () => [],
              },
            },
          },

          expect: function (wrap) {
            expect(wrap.findAll(ReminderComponent)).to.have.length(2)
          },
        },

        {
          name: 'no resource - don\'t show',
          feeds: [
            new Feed({ resource: 'no' }),
          ],
          modules: {
            module: {
              namespaced: true,
              state: {},
              getters: {
                set: () => [],
              },
            },
          },

          expect: function (wrap) {
            expect(wrap.find(ModuleComponent).exists()).to.be.false
            expect(wrap.find(ReminderComponent).exists()).to.be.false
          },
        },
      ]

      for (const t of tests) {
        const store = new Vuex.Store({ modules: t.modules })
        propsData.options.feeds = t.feeds
        const wrap = fmCalendar({ localVue, store })
        await fp()
        t.expect(wrap)
      }
    })

    it('should be able to add a new feed', () => {
      const store = new Vuex.Store({ modules: {
        module: {
          namespaced: true,
          state: {},
          getters: {
            set: () => [],
          },
        },
      } })
      propsData.options.feeds = [
        new Feed({ resource: resources.module })
      ]
      const wrap = mountCalendar({ localVue, store })
      wrap.find('b-button').trigger('click')
      expect(propsData.options.feeds).to.have.length(2)
    })

    it('should be able to remove a feed', () => {
      const store = new Vuex.Store({ modules: {
        module: {
          namespaced: true,
          state: {},
          getters: {
            set: () => [],
          },
        },
      } })
      propsData.options.feeds = [
        new Feed({ resource: resources.module })
      ]
      const wrap = fmCalendar({ localVue, store })

      wrap.find(FeedComponent).vm.removeFeed()
      expect(propsData.options.feeds).to.have.length(0)
    })
  })
})
