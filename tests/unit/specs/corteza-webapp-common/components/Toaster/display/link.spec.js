// /* eslint-disable */
// import { expect } from 'chai'
// import { TLink } from 'corteza-webapp-common/src/components/Toaster/display'
// import Reminder from 'corteza-webapp-common/src/lib/types/shared/reminder'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
//
// describe('components/Toaster/display/Link.vue', () => {
//   let propsData
//   beforeEach(() => {
//     propsData = { toast: new Reminder({}) }
//   })
//   const mountTL = (opt) => shallowMount(TLink, {
//     propsData,
//     ...opt,
//   })
//
//   it('use provided link; from href', () => {
//     propsData.toast = new Reminder({
//       payload: {
//         link: {
//           href: 'www.test.tld',
//         },
//         resource: 'example:*',
//       }
//     })
//     const wrap = mountTL()
//
//     expect(wrap.findAll('a')).to.have.length(1)
//   })
//
//   describe('get router-link from resource + meta', () => {
//     it('can fail; no resource', () => {
//       propsData.toast = new Reminder({
//         payload: {
//           link: {},
//         },
//         resource: undefined,
//       })
//       const wrap = mountTL()
//
//       expect(wrap.findAll('router-link')).to.have.length(0)
//     })
//
//     it('can fail; invalid resource', () => {
//       propsData.toast = new Reminder({
//         payload: {
//           link: {},
//         },
//         resource: 'unknown:resource:*',
//       })
//       const wrap = mountTL()
//
//       expect(wrap.findAll('router-link')).to.have.length(0)
//     })
//
//     it('success', () => {
//       propsData.toast = new Reminder({
//         payload: {
//           link: {},
//
//         },
//         resource: 'compose:record:132',
//       })
//       const wrap = mountTL()
//       expect(wrap.findAll('router-link-stub')).to.have.length(1)
//     })
//   })
// })
