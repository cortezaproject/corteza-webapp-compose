// /* eslint-disable */
// import { expect } from 'chai'
// import Toaster from 'corteza-webapp-common/src/components/Toaster'
// import Toast from 'corteza-webapp-common/src/lib/types/shared/reminder'
// import { Button, Dropdown } from 'corteza-webapp-common/src/components/Toaster/actions'
// import { TLink } from 'corteza-webapp-common/src/components/Toaster/display'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
//
// describe('components/Toaster/index.vue', () => {
//   let   propsData
//   beforeEach(() => {
//     propsData = {}
//   })
//   const mounToaster = (opt) => shallowMount(Toaster, {
//     propsData,
//     ...opt,
//   })
//
//   describe('toast rendering', () => {
//     it('render toasts based on prop', () => {
//       propsData.toasts = [
//         new Toast({ reminderID: '1', payload: {} }),
//         new Toast({ reminderID: '2', payload: {} }),
//         new Toast({ reminderID: '3', payload: {} }),
//       ]
//       const wrap = mounToaster()
//
//       expect(wrap.findAll('b-toast')).to.have.length(3)
//     })
//   })
//
//   describe('action rendering', () => {
//     it('render actions for given toast', () => {
//       propsData.toasts = [
//         new Toast({
//           reminderID: '1',
//           payload: {},
//           actions: {
//             act1: { kind: 'Button', label: 'label1' },
//             act2: { kind: 'Dropdown', label: 'label2' },
//             hide: { kind: 'Button', label: 'label2' },
//           },
//         }),
//       ]
//       const wrap = mounToaster()
//
//       // @note; Toaster uses toast's x button as hide handler
//       expect(wrap.findAll(Button)).to.have.length(1)
//       expect(wrap.findAll(Dropdown)).to.have.length(1)
//     })
//   })
//
//   describe('link rendering', () => {
//     it('renders link for given toast if requested', () => {
//       propsData.toasts = [
//         new Toast({
//           reminderID: '1',
//           resource: 'example:*',
//           payload: {
//             link: {
//               href: 'www.link.tld',
//             },
//           },
//         }),
//       ]
//       const wrap = mounToaster()
//
//       expect(wrap.findAll(TLink)).to.have.length(1)
//     })
//   })
// })
