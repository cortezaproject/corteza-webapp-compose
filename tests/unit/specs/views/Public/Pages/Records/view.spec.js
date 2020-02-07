// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import View from 'corteza-webapp-compose/src/views/Public/Pages/Records/View'
// import { compose } from '@cortezaproject/corteza-js'
// import sinon from 'sinon'
// import fp from 'flush-promises'
//
// describe('views/Public/Pages/Records/View.vue', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   let $ComposeAPI, propsData
//   beforeEach(() => {
//     $ComposeAPI = {}
//     propsData = {
//       namespace: new compose.Namespace({ namespaceID: '000' }),
//       page: new compose.Page({ pageID: '100', moduleID: '300' }),
//       recordID: '200',
//     }
//   })
//
//   const mountView = (opt) => shallowMount(View, {
//     mocks: { $ComposeAPI },
//     propsData,
//     ...opt,
//   })
//
//   const stubRecordLoad = () => {
//     sinon.stub(View.computed, 'module').returns(new compose.Module({ moduleID: '300', fields: [{ name: 'f1', kind: 'String' }] }))
//     $ComposeAPI.recordRead = sinon.stub().resolves({ recordID: '200', values: { f1: 'v1' } })
//   }
//
//   describe('record load', () => {
//     it('load record on component load', async () => {
//       stubRecordLoad()
//       const wrap = mountView()
//       await fp()
//
//       expect(wrap.vm.record).to.not.be.undefined
//       expect(wrap.vm.record.recordID).to.eq('200')
//     })
//   })
//
//
//   describe('on delete', () => {
//     it('preserve view, show notification', async () => {
//       stubRecordLoad()
//       const wrap = mountView()
//       sinon.stub(wrap.vm, 'deleteRecord').resolves({})
//       await fp()
//
//       wrap.vm.handleDelete()
//       await fp()
//
//       expect(wrap.vm.record).to.not.be.undefined
//       expect(wrap.find('b-alert').exists()).to.be.true
//     })
//   })
// })
