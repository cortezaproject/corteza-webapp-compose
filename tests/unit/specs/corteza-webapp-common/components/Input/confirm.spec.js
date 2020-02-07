// /* eslint-disable */
// import { expect } from 'chai'
// import { Confirm } from 'corteza-webapp-common/src/components/Input'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
//
// describe('components/Input/Confirm.vue', () => {
//   let wrap
//   const mountCT = (opt) => shallowMount(Confirm, {
//     ...opt,
//   })
//
//   const mountAndPrompt = (opt = {}) => {
//     wrap = mountCT(opt)
//     wrap.find('b-button').trigger('click')
//   }
//
//   describe('with confirmation', () => {
//     it('prompt confirmation/cancel', () => {
//       mountAndPrompt()
//
//       expect(wrap.findAll('b-button')).to.have.length(2)
//     })
//
//     it('confirm', () => {
//       mountAndPrompt()
//
//       const btns = wrap.findAll('b-button')
//       btns.at(0).trigger('click')
//
//       expect(wrap.emitted().confirmed).to.not.be.undefined
//       expect(wrap.findAll('b-button')).to.have.length(1)
//     })
//
//     it('cancel', () => {
//       mountAndPrompt()
//
//       const btns = wrap.findAll('b-button')
//       btns.at(1).trigger('click')
//
//       expect(wrap.emitted().confirmed).to.be.undefined
//       expect(wrap.findAll('b-button')).to.have.length(1)
//     })
//
//     it('disabled', () => {
//       mountAndPrompt({ propsData: { disabled: true } })
//
//       expect(wrap.findAll('b-button')).to.have.length(1)
//     })
//   })
//
//   describe('without confirmation', () => {
//     beforeEach(() => {
//       wrap = mountCT({
//         propsData: { noPrompt: true },
//       })
//     })
//
//     it('renders only the confirm button', () => {
//       expect(wrap.findAll('b-button')).to.have.length(1)
//     })
//
//     it('doesn\'t prompt for confirmation', () => {
//       wrap.find('b-button').trigger('click')
//
//       expect(wrap.emitted().confirmed).to.not.be.undefined
//       expect(wrap.findAll('b-button')).to.have.length(1)
//     })
//
//     it('disabled', () => {
//       wrap.setProps({ disabled: true })
//       wrap.find('b-button').trigger('click')
//
//       expect(wrap.emitted().confirmed).to.be.undefined
//       expect(wrap.findAll('b-button')).to.have.length(1)
//     })
//   })
//
// })
