// /* eslint-disable */
// import { expect } from 'chai'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import basic from 'corteza-webapp-compose/src/lib/field/Configurator/basic'
//
// describe.skip('src/lib/field/Configurator/basic.vue', () => {
//   let propsData
//   beforeEach(() => {
//     propsData = {
//       field: {
//         kind: 'String',
//         name: 'defaultValue',
//         options: null,
//       },
//     }
//   })
//   const mountBasic = (opt) => shallowMount(basic, {
//     propsData,
//     ...opt,
//   })
//
//   it('should properly set mockRecord - no default value', () => {
//     const wrap = mountBasic()
//
//     const expectedCompareToValues = { defaultValue: undefined }
//     expect(wrap.vm.mockRecord.compareToValues).to.deep.eq(expectedCompareToValues)
//
//     expect(wrap.vm.mockRecord.values).to.have.property('defaultValue').that.deep.equals(undefined)
//   })
//
//   it('should properly set mockRecord - with default value', () => {
//     propsData.field.defaultValue = [{ name: 'defaultValue', value: '1' }]
//     const wrap = mountBasic()
//
//     const expectedCompareToValues = { defaultValue: '1' }
//     expect(wrap.vm.mockRecord.compareToValues).to.deep.eq(expectedCompareToValues)
//
//     expect(wrap.vm.mockRecord.values).to.have.property('defaultValue').that.deep.equals('1')
//   })
// })
