// /* eslint-disable */
// import { expect } from 'chai'
// import Select from 'corteza-webapp-compose/src/lib/field/Viewer/Select'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
//
// describe.skip('lib/field/Viewer/Select.vue', () => {
//   let propsData
//   beforeEach(() => {
//     propsData = {
//       namespace: {
//         namespaceID: '0001'
//       },
//       field: {
//         kind: 'Select',
//         name: 'uu',
//         options: {}
//       },
//       record: {
//         recordID: '1000',
//         values: {
//           uu: ''
//         },
//       },
//       valueOnly: true,
//     }
//   })
//   const mountSelect = (opt) => shallowMount(Select, {
//     propsData,
//     ...opt,
//   })
//
//   it('determine field label (not multi-value)', () => {
//     const tests = [
//       {
//         name: 'valid entries',
//         options: [{ value: 'o1', text: 'l1' }],
//         values: { uu: 'o1' },
//         expected: function (wrap) {
//           const opt = wrap.find('div')
//           expect(opt.exists(), this.name).to.be.true
//           expect(opt.html(), this.name).to.include('l1')
//         },
//       },
//
//       {
//         name: 'fallback to value',
//         options: [{ value: 'o1' }],
//         values: { uu: 'o1' },
//         expected: function (wrap) {
//           const opt = wrap.find('div')
//           expect(opt.exists(), this.name).to.be.true
//           expect(opt.html(), this.name).to.include('o1')
//         },
//       },
//     ]
//
//     for (const t of tests) {
//       propsData.field.options.options = t.options
//       propsData.record.values = t.values
//       const wrap = mountSelect()
//       t.expected(wrap)
//     }
//   })
//
//   it('determine field label (multi-value)', () => {
//     const tests = [
//       {
//         name: 'valid entries',
//         options: [{ value: 'o1', text: 'l1' }, { value: 'o2', text: 'l2' }],
//         values: { uu: ['o1', 'o2'] },
//         expected: function (wrap) {
//           const opt = wrap.find('div')
//           expect(opt.exists(), this.name).to.be.true
//           expect(opt.html(), this.name).to.include('l1')
//           expect(opt.html(), this.name).to.include('l2')
//         },
//       },
//
//       {
//         name: 'fallback to value',
//         options: [{ value: 'o1' }, { value: 'o2' }],
//         values: { uu: ['o1', 'o2'] },
//         expected: function (wrap) {
//           const opt = wrap.find('div')
//           expect(opt.exists(), this.name).to.be.true
//           expect(opt.html(), this.name).to.include('o1')
//           expect(opt.html(), this.name).to.include('o2')
//         },
//       },
//     ]
//
//     for (const t of tests) {
//       propsData.field.options.options = t.options
//       propsData.record.values = t.values
//       propsData.field.isMulti = true
//       const wrap = mountSelect()
//       t.expected(wrap)
//     }
//   })
// })
