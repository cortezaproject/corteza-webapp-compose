// /* eslint-disable */
// import { expect } from 'chai'
// import { DateTime } from 'corteza-webapp-common/src/components/Input'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
//
// describe('components/Input/DateTime.vue', () => {
//   const stdD = '2000-01-01'
//   const stdT = '01:02'
//
//   let wrap
//   const mountDT = (opt) => shallowMount(DateTime, {
//     propsData,
//     ...opt,
//   })
//
//   let propsData = {}
//   beforeEach(() => {
//     propsData = {}
//   })
//
//   describe('date get/set', () => {
//     it('get - invalid value', () => {
//       propsData.value = ''
//       const wrap = mountDT()
//
//       expect(wrap.vm.date).to.be.undefined
//     })
//
//     it('get - valid value', () => {
//       propsData.value = `${stdD} ${stdT}`
//       const wrap = mountDT()
//
//       expect(wrap.vm.date).to.eq(stdD)
//     })
//
//     it('set', () => {
//       propsData.value = ``
//       const wrap = mountDT()
//
//       wrap.vm.setDate(stdD)
//       expect(wrap.emitted().input.pop().pop()).to.include(stdD)
//     })
//   })
//
//   describe('time get/set', () => {
//     it('get - invalid value', () => {
//       propsData.value = ''
//       const wrap = mountDT()
//
//       expect(wrap.vm.time).to.be.undefined
//     })
//
//     it('get - valid value', () => {
//       propsData.value = `${stdD} ${stdT}`
//       const wrap = mountDT()
//
//       expect(wrap.vm.time).to.eq(stdT)
//     })
//
//     it('set', () => {
//       propsData.value = ``
//       const wrap = mountDT()
//
//       wrap.vm.setTime(stdT)
//       expect(wrap.emitted().input.pop().pop()).to.include(stdT)
//     })
//   })
//
//   describe('set partial values due to disabled date/time', () => {
//     it('disabled date', () => {
//       propsData.value = ``
//       propsData.noDate = true
//       let wrap = mountDT()
//
//       wrap.vm.setTime(stdT)
//       expect(wrap.emitted().input.pop().pop()).to.include(stdT)
//
//       wrap = mountDT()
//       wrap.vm.setDate(stdD)
//       expect(wrap.emitted().input).to.be.undefined
//     })
//
//     it('disabled time', () => {
//       propsData.value = ``
//       propsData.noTime = true
//       let wrap = mountDT()
//
//       wrap.vm.setDate(stdD)
//       expect(wrap.emitted().input.pop().pop()).to.include(stdD)
//
//       wrap = mountDT()
//       wrap.vm.setTime(stdT)
//       expect(wrap.emitted().input).to.be.undefined
//     })
//
//     it('disabled date & time', () => {
//       propsData.value = ``
//       propsData.noDate = true
//       propsData.noTime = true
//       let wrap = mountDT()
//
//       wrap.vm.setTime(stdT)
//       expect(wrap.emitted().input).to.be.undefined
//
//       wrap.vm.setDate(stdD)
//       expect(wrap.emitted().input).to.be.undefined
//     })
//   })
// })
