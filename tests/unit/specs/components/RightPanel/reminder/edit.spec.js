// /* eslint-disable */
// import { expect } from 'chai'
// import Edit from 'corteza-webapp-compose/src/components/RightPanel/reminder/Edit'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
//
// describe('components/RightPanel/reminder/Edit.vue', () => {
//   let propsData
//   beforeEach(() => {
//     propsData = { myID: '1', users: [] }
//   })
//   const mountEdit = (opt) => shallowMount(Edit, {
//     propsData,
//     ...opt,
//   })
//
//   describe('emit save with payload', () => {
//     it('Defined time', () => {
//       propsData.edit = {
//         resource: 'example:*',
//         payload: {
//           remindAt: 1000,
//         },
//       }
//       const wrap = mountEdit()
//       wrap.vm.saveAndClose()
//
//       const evt = wrap.emitted().save.pop().pop()
//       expect(evt.remindAt).to.not.be.undefined
//     })
//
//     it('Undefined time', () => {
//       propsData.edit = {
//         resource: 'example:*',
//         payload: {},
//       }
//       const wrap = mountEdit()
//       wrap.vm.saveAndClose()
//
//       const evt = wrap.emitted().save.pop().pop()
//       expect(evt.remindAt).to.be.undefined
//     })
//   })
// })
