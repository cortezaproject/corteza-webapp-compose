// /* eslint-disable */
// import { expect } from 'chai'
// import { PDF } from 'corteza-webapp-common/src/components/FilePreview/Inline/types'
// import { Document } from 'corteza-webapp-common/src/components/FilePreview/common/PDF/helpers'
// import { fullMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import sinon from 'sinon'
// import fp from 'flush-promises'
//
// describe('components/FilePreview/Inline/types/PDF.vue', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   let propsData
//   beforeEach(() => {
//     propsData = {}
//   })
//   const mountPDF = (opt) => fullMount(PDF, {
//     propsData,
//     ...opt,
//   })
//
//   it('fail if no src provided', () => {
//     propsData.src = ''
//     const wrap = mountPDF()
//     expect(wrap.find('.doc-msg.doc-err').exists()).to.be.true
//   })
//
//   describe('document rendering', () => {
//     let document
//     beforeEach(() => {
//       document = new Document({
//         pdf: {
//           numPages: 2,
//         },
//       })
//       sinon.stub(PDF.methods, 'renderPage').resolves({})
//       propsData.maxRetries = 1
//       propsData.retryBackoff = 0
//     })
//
//     it('allow document to be reused', async () => {
//       propsData.src = document
//       const wrap = mountPDF()
//
//       await fp()
//       expect(wrap.findAll('div.pages div')).to.have.length(2)
//     })
//
//     it('get document from src', done => {
//       propsData.src = 'test.pdf'
//       sinon.stub(PDF.methods, 'pdfjsLoad').resolves({ numPages: 3 })
//       const wrap = mountPDF()
//
//       setTimeout(async () => {
//         expect(wrap.findAll('div.pages div')).to.have.length(3)
//         sinon.assert.calledOnce(PDF.methods.pdfjsLoad)
//         done()
//       }, 10)
//     })
//
//     it('should retry x times if doc load fails', done => {
//       propsData.src = 'test.pdf'
//       sinon.stub(PDF.methods, 'pdfjsLoad')
//       PDF.methods.pdfjsLoad.onCall(0).rejects(new Error('error'))
//       PDF.methods.pdfjsLoad.onCall(1).resolves({ numPages: 3 })
//       propsData.maxRetries = 2
//       const wrap = mountPDF()
//
//       setTimeout(async () => {
//         expect(wrap.findAll('div.pages div')).to.have.length(3)
//         sinon.assert.calledTwice(PDF.methods.pdfjsLoad)
//         done()
//       }, 10)
//     })
//
//     it('should fail if fails to load x times', done => {
//       propsData.src = 'test.pdf'
//       sinon.stub(PDF.methods, 'pdfjsLoad').rejects(new Error('error'))
//       propsData.maxRetries = 2
//       const wrap = mountPDF()
//
//       setTimeout(async () => {
//         expect(wrap.findAll('div.pages div')).to.have.length(0)
//         expect(wrap.findAll('div.doc-msg.doc-err').exists()).to.be.true
//
//         done()
//       }, 10)
//     })
//   })
// })
