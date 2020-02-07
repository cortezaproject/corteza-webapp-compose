// /* eslint-disable */
// import { expect } from 'chai'
// import Inline from 'corteza-webapp-common/src/components/FilePreview/Inline'
// import { IMG, PDF } from 'corteza-webapp-common/src/components/FilePreview/Inline/types'
// import { fullMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import sinon from 'sinon'
//
// describe('components/FilePreview/Inline', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   let propsData
//   beforeEach(() => {
//     propsData = {}
//   })
//   const mountInline = (opt) => fullMount(Inline, {
//     propsData,
//     ...opt,
//   })
//
//   it('determine component to use', () => {
//     const tests = [
//       {
//         name: 'Image - png',
//         props: {
//           src: 'test.png',
//           meta: { preview: { image: { height: 0, width: 0 } } },
//         },
//         expect: IMG,
//       },
//       {
//         name: 'Image - jpg',
//         props: {
//           src: 'test.jpg',
//           meta: { preview: { image: { height: 0, width: 0 } } },
//         },
//         expect: IMG,
//       },
//       {
//         name: 'Image - jpeg',
//         props: {
//           src: 'test.jpeg',
//           meta: { preview: { image: { height: 0, width: 0 } } },
//         },
//         expect: IMG,
//       },
//       {
//         name: 'Image - gif',
//         props: {
//           src: 'test.gif',
//           meta: { preview: { image: { height: 0, width: 0 } } },
//         },
//         expect: IMG,
//       },
//       {
//         name: 'PDF',
//         props: {
//           src: 'test.pdf',
//         },
//         expect: PDF,
//       },
//     ]
//     for (const t of tests) {
//       propsData = t.props
//       const wrap = mountInline()
//       expect(wrap.find(t.expect).exists()).to.be.true
//     }
//   })
// })
