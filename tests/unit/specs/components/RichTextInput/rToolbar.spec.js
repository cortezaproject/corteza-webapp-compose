// /* eslint-disable */
// import { expect } from 'chai'
// import RToolbar from 'corteza-webapp-compose/src/components/RichTextInput/RToolbar'
// import { TItem, TItemVariants, TColors, TLink } from 'corteza-webapp-compose/src/components/RichTextInput/RToolbar/loader'
// import { fullMount } from 'corteza-webapp-compose/tests/lib/helpers'
//
// describe('components/RichTextInput/RToolbar.vue', () => {
//   let propsData
//   beforeEach(() => {
//     propsData = {
//       commands: {},
//       isActive: {},
//       getMarkAttrs: () => false,
//       formats: [],
//     }
//   })
//   const mountRT = (opt) => fullMount(RToolbar, {
//     propsData,
//     stubs: ['editor-menu-bar'],
//     ...opt,
//   })
//
//   it('render formatters', () => {
//     const tests = [
//       {
//         name: 'regular item',
//         propsData: {
//           formats: [
//             { type: 'bold' },
//           ],
//           isActive: {
//             bold: () => false,
//           },
//         },
//         expected: TItem,
//       },
//
//       {
//         name: 'link item',
//         propsData: {
//           formats: [
//             { type: 'link', attrs: { href: null } },
//           ],
//           isActive: {
//             link: () => false,
//           },
//         },
//         expected: TLink,
//       },
//
//       {
//         name: 'color item',
//         propsData: {
//           formats: [
//             { type: 'color', colorPicker: true },
//           ],
//           isActive: {
//             color: () => false,
//           },
//         },
//         expected: TColors,
//       },
//
//       {
//         name: 'variant items',
//         propsData: {
//           formats: [
//             {
//               type: 'paragraph',
//               variants: [ { variant: 'left', attrs: { alignment: 'left' } } ],
//             },
//           ],
//           isActive: {
//             paragraph: () => false,
//           },
//         },
//         expected: TItemVariants,
//       },
//     ]
//
//     for (const t of tests) {
//       propsData = { ...propsData, ...t.propsData }
//       expect(mountRT().find(t.expected).exists(), t.name).to.be.true
//     }
//   })
// })
