// /* eslint-disable */
// import { expect } from 'chai'
// import Select from 'corteza-webapp-compose/src/lib/field/Editor/Select'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
//
// describe('lib/field/Editor/Select.vue', () => {
//   let propsData
//   beforeEach(() => {
//     propsData = {
//       namespace: {
//         namespaceID: '0001'
//       },
//       field: {
//         kind: 'Select',
//         name: 'uu',
//         validate: () => {},
//         options: {},
//       },
//       record: {
//         recordID: '1000',
//         values: {
//           uu: ''
//         },
//         compareToValues: {},
//       },
//       valueOnly: true,
//     }
//   })
//   const mountSelect = (opt) => shallowMount(Select, {
//     propsData,
//     ...opt,
//   })
//
//   it('determine field label for multi-value fields', () => {
//     const tests = [
//       {
//         name: 'valid entries',
//         options: [{ value: 'o1', text: 'l1' }],
//         value: 'o1',
//         expected: 'l1',
//       },
//       {
//         name: 'fallback to value',
//         options: [{ value: 'o1' }],
//         value: 'o1',
//         expected: 'o1',
//       },
//       {
//         name: 'fallback to value if option not found',
//         options: [],
//         value: 'o1',
//         expected: 'o1',
//       },
//     ]
//
//     // @todo improve this
//     for (const t of tests) {
//       propsData.field.options.options = t.options
//
//       const wrap = mountSelect()
//       expect(wrap.vm.findLabel(t.value), t.name).to.eq(t.expected)
//     }
//   })
// })
