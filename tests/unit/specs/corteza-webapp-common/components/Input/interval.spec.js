// /* eslint-disable */
// import { expect } from 'chai'
// import { Interval } from 'corteza-webapp-common/src/components/Input'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
//
// describe('components/Input/Interval.vue', () => {
//   const mountInterval = (opt) => shallowMount(Interval, {
//     propsData,
//     ...opt,
//   })
//
//   let propsData = {}
//   beforeEach(() => {
//     propsData = {}
//   })
//
//   describe('options', () => {
//     it('has default options', () => {
//       const wrap = mountInterval()
//
//       expect(wrap.vm.cOptions).to.not.have.length(0)
//     })
//
//     it('can append options', () => {
//       propsData.optionsAppend = [{}, {}]
//       const wrap = mountInterval()
//
//       expect(wrap.vm.cOptions.length).to.be.gte(2)
//     })
//
//     it('can overwrite options', () => {
//       propsData.options = [{}, {}]
//       const wrap = mountInterval()
//
//       expect(wrap.vm.cOptions.length).to.be.eq(2)
//     })
//   })
// })
