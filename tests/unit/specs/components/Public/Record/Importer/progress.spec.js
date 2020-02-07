// /* eslint-disable */
// import { expect } from 'chai'
// import Progress from 'corteza-webapp-compose/src/components/Public/Record/Importer/Progress'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import sinon from 'sinon'
//
// describe('components/Public/Record/Importer/Progress.vue', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   let propsData, $ComposeAPI
//   beforeEach(() => {
//     propsData = {
//       noPool: true,
//       session: {},
//     }
//   })
//
//   const mountProgress = (opt) => shallowMount(Progress, {
//     propsData,
//     ...opt,
//   })
//
//   describe('handle progress update', () => {
//     it('nothing special - do nothing', () => {
//       const wrap = mountProgress()
//       wrap.setData({ progress: { finishedAt: null, failed: false, count: 1 } })
//
//       expect(wrap.emitted().importFailed).to.be.undefined
//     })
//
//     it('finished & failed - emit failed event', () => {
//       const wrap = mountProgress()
//       wrap.setData({ progress: { finishedAt: 'some time', failed: true, count: 1 } })
//
//       expect(wrap.emitted().importFailed).to.not.be.undefined
//     })
//
//     it('finished - show notification', () => {
//       const wrap = mountProgress()
//       wrap.setData({ progress: { finishedAt: 'some time', failed: false, count: 1 } })
//
//       expect(wrap.find('span.text-success').exists()).to.be.true
//     })
//   })
// })
