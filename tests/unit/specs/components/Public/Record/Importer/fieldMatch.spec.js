// /* eslint-disable */
// import { expect } from 'chai'
// import FieldMatch from 'corteza-webapp-compose/src/components/Public/Record/Importer/FieldMatch'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import sinon from 'sinon'
//
// describe('components/Public/Record/Importer/FieldMatch.vue', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   let propsData
//   beforeEach(() => {
//     propsData = {
//       module: {
//         moduleID: 'module1',
//         fields: [
//           { name: 'mf1' },
//           { name: 'f2' },
//         ]
//       },
//
//       session: {
//         fields: {
//           'f1': '',
//           'f2': '',
//           'f3': 'af3',
//         }
//       }
//     }
//   })
//
//   const mountFM = (opt) => shallowMount(FieldMatch, {
//     propsData,
//     ...opt,
//   })
//
//   it('make rows for user to edit', () => {
//     const wrap = mountFM()
//     const { rows } = wrap.vm
//
//     expect(wrap.vm.rows).to.have.length(3)
//     expect(rows[0].fileColumn).to.eq('f1')
//     expect(rows[0].moduleField).to.eq(undefined)
//
//     expect(rows[1].fileColumn).to.eq('f2')
//     expect(rows[1].moduleField).to.eq('f2')
//
//     expect(rows[2].fileColumn).to.eq('f3')
//     expect(rows[2].moduleField).to.eq('af3')
//   })
//
//   describe('on next step', () => {
//     it('validate', () => {
//       const wrap = mountFM({ computed: { canContinue: sinon.stub().returns(false) } })
//       wrap.vm.nextStep()
//
//       expect(wrap.emitted().fieldsMatched).to.be.undefined
//     })
//
//     it('make api payload', () => {
//       const wrap = mountFM({ computed: { canContinue: sinon.stub().returns(true) } })
//       wrap.setData({
//         rows: [
//           { selected: true, fileColumn: 'fc1', moduleField: 'mf1' },
//           { selected: false, fileColumn: 'fc2', moduleField: 'mf2' },
//         ],
//       })
//       wrap.vm.nextStep()
//
//       const fields = wrap.emitted().fieldsMatched.pop().pop()
//       expect(fields).to.deep.eq({ 'fc1': 'mf1' })
//     })
//   })
//
//   it('determine if can continue', () => {
//     const test = [
//       [ [{ moduleField: undefined, selected: false }], false ],
//       [ [{ moduleField: undefined, selected: true }], false ],
//       [ [{ moduleField: 'f1', selected: false }], false ],
//       [ [{ moduleField: 'f1', selected: true }], true ],
//     ]
//
//     for (const [rows, expected] of test) {
//       expect(FieldMatch.computed.canContinue.call({ rows })).to.eq(expected)
//     }
//   })
//
//   it('determine available module fields', () => {
//     let local = {
//       module: {
//         fields: [{ name: 'f1', label: 'l1' }],
//       },
//     }
//
//     expect(FieldMatch.computed.moduleFields.call(local)).to.have.length(1)
//   })
// })
