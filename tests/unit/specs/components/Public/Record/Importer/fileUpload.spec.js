// /* eslint-disable */
// import { expect } from 'chai'
// import FileUpload from 'corteza-webapp-compose/src/components/Public/Record/Importer/FileUpload'
// import Uploader from 'corteza-webapp-compose/src/components/Public/Page/Attachment/Uploader'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import sinon from 'sinon'
//
// describe('components/Public/Record/Importer/FileUpload.vue', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   let propsData, $ComposeAPI
//   beforeEach(() => {
//     $ComposeAPI = {
//       recordImportInitEndpoint: sinon.stub().returns('/endpoint'),
//     }
//
//     propsData = {
//       namespace: { namespaceID: 'namespace1' },
//       module: { moduleID: 'module1' },
//     }
//   })
//
//   const mountFpl = (opt) => shallowMount(FileUpload, {
//     propsData,
//     mocks: { $ComposeAPI },
//     ...opt,
//   })
//
//   it('on upload create a session', () => {
//     const wrap  = mountFpl()
//     wrap.find(Uploader).vm.$emit('uploaded', { sessionID: 'sessionID' })
//
//     expect(wrap.vm.session).to.not.be.null
//   })
//
//   it('emit import session', () => {
//     const wrap  = mountFpl()
//     wrap.vm.fileUploaded()
//
//     expect(wrap.emitted().fileUploaded).to.not.be.undefined
//   })
// })
