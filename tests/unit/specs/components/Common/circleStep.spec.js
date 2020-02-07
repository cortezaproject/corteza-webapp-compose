// /* eslint-disable */
// import { expect } from 'chai'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import CircleStep from 'corteza-webapp-compose/src/components/Common/CircleStep'
//
// describe('components/Common/CircleStep.vue', () => {
//   let propsData
//   const mountCS = (opt) => shallowMount(CircleStep, {
//     mocks: {},
//     propsData,
//     ...opt,
//   })
//
//   beforeEach(() => {
//     propsData = {
//       done: false,
//     }
//   })
//
//   it('generate popover\'s content', () => {
//     const tests = [
//       {
//         name: 'optional, so should have content',
//         optional: true,
//         expected: 'onboarding.step.optional',
//       },
//
//       {
//         name: 'required, so should have no content',
//         optional: false,
//         expected: '',
//       },
//     ]
//
//     for (const t of tests) {
//       propsData.optional = t.optional
//       const wrap = mountCS()
//       expect(wrap.vm.popoverContent, t.name).to.eq(t.expected)
//     }
//   })
// })
