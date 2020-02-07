// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { shallowMount, fullMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import { createLocalVue } from '@vue/test-utils'
//
// import FeedSource from 'corteza-webapp-compose/src/lib/block/BuilderEdit/Calendar/FeedSource'
// import { Calendar } from 'corteza-webapp-compose/src/lib/block/Calendar'
// import { record as RecordComponent, reminder as ReminderComponent } from 'corteza-webapp-compose/src/lib/block/BuilderEdit/Calendar/FeedSource/configs'
//
// import Feed from 'corteza-webapp-compose/src/lib/block/Calendar/feed'
// import { compose } from '@cortezaproject/corteza-js'
// import { resources } from 'corteza-webapp-compose/src/lib/block/Calendar'
//
// import Vuex from 'vuex'
// import sinon from 'sinon'
// import fp from 'flush-promises'
//
// const localVue = createLocalVue()
// localVue.use(Vuex)
//
// describe('src/lib/block/BuilderEdit/Calendar/FeedSource', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   let propsData
//   beforeEach(() => {
//     propsData = {
//       namespace: new compose.Namespace({ namespaceID: '1001' }),
//       page: { pageID: '2001' },
//       options: new Calendar({ defaultView: 'dayGridMonth' }),
//     }
//   })
//
//   const mountFS = (opt) => shallowMount(FeedSource, {
//     mocks: {},
//     propsData,
//     ...opt,
//   })
//
//   const fmFS = (opt) => fullMount(FeedSource, {
//     mocks: {},
//     propsData,
//     ...opt,
//   })
//
//   describe('feed rendering', () => {
//     it('should be able to show a set of fields', async () => {
//       const tests = [
//         {
//           name: 'module feed',
//           feeds: [
//             new Feed({ resource: resources.record, options: { moduleID: '0001' } }),
//             new Feed({ resource: resources.record, options: { moduleID: '0002' } }),
//           ],
//           modules: {
//             module: {
//               namespaced: true,
//               state: {},
//               getters: {
//                 set: () => [ new compose.Module({ moduleID: '0001', fields: [] }) ],
//               },
//             },
//           },
//
//           expect: function (wrap) {
//             expect(wrap.findAll(RecordComponent)).to.have.length(2)
//           },
//         },
//
//         {
//           name: 'reminder feed',
//           feeds: [
//             new Feed({ resource: resources.reminder }),
//             new Feed({ resource: resources.reminder }),
//           ],
//           modules: {
//             module: {
//               namespaced: true,
//               state: {},
//               getters: {
//                 set: () => [],
//               },
//             },
//           },
//
//           expect: function (wrap) {
//             expect(wrap.findAll(ReminderComponent)).to.have.length(2)
//           },
//         },
//
//         {
//           name: 'no resource - don\'t show',
//           feeds: [
//             new Feed({ resource: 'no' }),
//           ],
//           modules: {
//             module: {
//               namespaced: true,
//               state: {},
//               getters: {
//                 set: () => [],
//               },
//             },
//           },
//
//           expect: function (wrap) {
//             expect(wrap.find(RecordComponent).exists()).to.be.false
//             expect(wrap.find(ReminderComponent).exists()).to.be.false
//           },
//         },
//       ]
//
//       for (const t of tests) {
//         const store = new Vuex.Store({ modules: t.modules })
//         propsData.options.feeds = t.feeds
//         const wrap = fmFS({ localVue, store })
//         await fp()
//         t.expect(wrap)
//       }
//     })
//
//     it('should be able to add a new feed', () => {
//       const store = new Vuex.Store({ modules: {
//         module: {
//           namespaced: true,
//           state: {},
//           getters: {
//             set: () => [],
//           },
//         },
//       } })
//       propsData.options.feeds = [
//         new Feed({ resource: resources.record })
//       ]
//       const wrap = mountFS({ localVue, store })
//       wrap.find('b-button.test-feed-add').trigger('click')
//       expect(propsData.options.feeds).to.have.length(2)
//     })
//
//     it('should be able to remove a feed', () => {
//       const store = new Vuex.Store({ modules: {
//         module: {
//           namespaced: true,
//           state: {},
//           getters: {
//             set: () => [],
//           },
//         },
//       } })
//       propsData.options.feeds = [
//         new Feed({ resource: resources.record })
//       ]
//       const wrap = fmFS({ localVue, store })
//
//       wrap.vm.onRemoveFeed(0)
//       expect(propsData.options.feeds).to.have.length(0)
//     })
//   })
// })
