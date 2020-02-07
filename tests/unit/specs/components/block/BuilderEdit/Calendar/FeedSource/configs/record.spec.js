// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import Feed from 'corteza-webapp-compose/src/lib/block/Calendar/feed'
// import { record as RecordComponent } from 'corteza-webapp-compose/src/lib/block/BuilderEdit/Calendar/FeedSource/configs'
// import { resources } from 'corteza-webapp-compose/src/lib/block/Calendar'
// import sinon from 'sinon'
//
// describe('src/lib/block/BuilderEdit/Calendar/FeedSource/configs/Module', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   let propsData
//   beforeEach(() => {
//     propsData = {
//       feed: new Feed({}),
//       modules: [],
//     }
//   })
//
//   const mountRecord = (opt) => shallowMount(RecordComponent, {
//     mocks: {},
//     propsData,
//     ...opt,
//   })
//
//   it('default props - to raise coverage', () => {
//     propsData.feed = undefined,
//     propsData.modules = undefined
//     mountRecord()
//   })
//
//   describe('determine fields', () => {
//     describe('date fields', () => {
//       it('determine date fields', () => {
//         const tests = [
//           {
//             name: 'determine fields',
//             feed: new Feed({ resource: resources.record, options: { moduleID: '0001' } }),
//             modules: [
//               new compose.Module({ moduleID: '0001', fields: [
//                 { name: 'f1', kind: 'DateTime' },
//                 { name: 'f2', kind: 'String' },
//               ] }),
//             ],
//             expect: function (wrap) {
//               expect(wrap.vm.dateFields).to.have.length(4)
//               const expected = [
//                 'f1',
//                 'createdAt',
//                 'updatedAt',
//                 'deletedAt',
//               ]
//               wrap.vm.dateFields.forEach((f, i) => {
//                 expect(f.name).to.eq(expected[i])
//               })
//             }
//           },
//           {
//             name: 'bail if no module',
//             feed: new Feed({ resource: resources.record, options: { moduleID: '0001' } }),
//             modules: [],
//             expect: function (wrap) {
//               expect(wrap.vm.dateFields).to.have.length(0)
//             }
//           },
//         ]
//         for (const t of tests) {
//           propsData.feed = t.feed
//           propsData.modules = t.modules
//           const wrap = mountRecord()
//           t.expect(wrap)
//         }
//       })
//
//       it('ignore multi-value date fields', () => {
//         const tests = [
//           {
//             name: 'ignore fields',
//             feed: new Feed({ resource: resources.record, options: { moduleID: '0001' } }),
//             modules: [
//               new compose.Module({ moduleID: '0001', fields: [
//                 { name: 'f1', kind: 'DateTime', isMulti: true },
//               ] }),
//             ],
//             expect: function (wrap) {
//               expect(wrap.vm.dateFields).to.have.length(3)
//               expect(wrap.vm.dateFields.map(({ name }) => name)).to.not.include.members(['f1'])
//             }
//           },
//         ]
//         for (const t of tests) {
//           propsData.feed = t.feed
//           propsData.modules = t.modules
//           const wrap = mountRecord()
//           t.expect(wrap)
//         }
//       })
//
//       it('show note if multi-value fields are ignored', () => {
//         const tests = [
//           {
//             name: 'determine note',
//             feed: new Feed({ resource: resources.record, options: { moduleID: '0001' } }),
//             modules: [
//               new compose.Module({ moduleID: '0001', fields: [
//                 { name: 'f1', kind: 'DateTime', isMulti: true },
//               ] }),
//             ],
//             expect: function (wrap) {
//               expect(wrap.find('.test-multi-field-ntf').exists()).to.be.true
//             }
//           },
//           {
//             name: 'bail if no module',
//             feed: new Feed({ resource: resources.record, options: {} }),
//             modules: [],
//             expect: function (wrap) {
//               expect(wrap.find('.test-multi-field-ntf').exists()).to.be.false
//             }
//           },
//         ]
//         for (const t of tests) {
//           propsData.feed = t.feed
//           propsData.modules = t.modules
//           const wrap = mountRecord()
//           t.expect(wrap)
//         }
//       })
//     })
//
//     it('determine title fields', () => {
//       const tests = [
//         {
//           name: 'determine fields',
//           feed: new Feed({ resource: resources.record, options: { moduleID: '0001' } }),
//           modules: [
//             new compose.Module({ moduleID: '0001', fields: [
//               { name: 'f1', kind: 'String' },
//             ] }),
//           ],
//           expect: function (wrap) {
//             expect(wrap.vm.titleFields, this.name).to.have.length(1)
//             const expected = [
//               'f1',
//             ]
//             wrap.vm.titleFields.forEach((f, i) => {
//               expect(f.name, this.name).to.eq(expected[i])
//             })
//           },
//         },
//
//         {
//           name: 'no module - bail',
//           feed: new Feed({ resource: resources.record, options: { moduleID: '0001' } }),
//           modules: [],
//           expect: function (wrap) {
//             expect(wrap.vm.titleFields, this.name).to.have.length(0)
//           },
//         },
//       ]
//
//       for (const t of tests) {
//         propsData.feed = t.feed
//         propsData.modules = t.modules
//         const wrap = mountRecord()
//         t.expect(wrap)
//       }
//     })
//   })
// })
