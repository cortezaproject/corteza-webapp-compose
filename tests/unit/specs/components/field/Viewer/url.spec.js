// /* eslint-disable */
// import { expect } from 'chai'
// import Url from 'corteza-webapp-compose/src/lib/field/Viewer/Url'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
//
// describe.skip('lib/field/Viewer/Url.vue', () => {
//   let propsData
//   beforeEach(() => {
//     propsData = {
//       namespace: {
//         namespaceID: '0001'
//       },
//       field: {
//         kind: 'Url',
//         name: 'uu',
//         options: {}
//       },
//       record: {
//         recordID: '1000',
//         values: {
//           uu: ''
//         },
//       },
//     }
//   })
//   const mountUrl = (opt) => shallowMount(Url, {
//     propsData,
//     ...opt,
//   })
//
//   it('should output the desired URL', () => {
//     const tests = [
//       {
//         name: 'plain old URL',
//         options: {},
//         url: 'https://www.test.tld/path?q=ww#hash',
//         tag: 'a',
//         expected: {
//           url: 'https://www.test.tld/path?q=ww#hash',
//           label: 'https://www.test.tld/path?q=ww#hash',
//         },
//       },
//       {
//         name: 'trim fragment',
//         options: {
//           trimFragment: true,
//         },
//         url: 'https://www.test.tld/path?q=ww#hash',
//         tag: 'a',
//         expected: {
//           url: 'https://www.test.tld/path?q=ww',
//           label: 'https://www.test.tld/path?q=ww',
//         },
//       },
//       {
//         name: 'trim query',
//         options: {
//           trimQuery: true,
//         },
//         url: 'https://www.test.tld/path?q=ww#hash',
//         tag: 'a',
//         expected: {
//           url: 'https://www.test.tld/path#hash',
//           label: 'https://www.test.tld/path#hash',
//         },
//       },
//
//       {
//         name: 'trim path',
//         options: {
//           trimPath: true,
//         },
//         url: 'https://www.test.tld/path?q=ww#hash',
//         tag: 'a',
//         expected: {
//           url: 'https://www.test.tld/?q=ww#hash',
//           label: 'https://www.test.tld/?q=ww#hash',
//         },
//       },
//
//       {
//         name: 'securify',
//         options: {
//           onlySecure: true,
//         },
//         url: 'http://www.test.tld/path?q=ww#hash',
//         tag: 'a',
//         expected: {
//           url: 'https://www.test.tld/path?q=ww#hash',
//           label: 'https://www.test.tld/path?q=ww#hash',
//         },
//       },
//
//       {
//         name: 'plain-text output',
//         options: {
//           outputPlain: true,
//         },
//         url: 'https://www.test.tld/path?q=ww#hash',
//         tag: 'span',
//         expected: {
//           url: undefined,
//           label: 'https://www.test.tld/path?q=ww#hash',
//         },
//       },
//     ]
//
//     for (const t of tests) {
//       propsData.field.options = t.options
//       propsData.record.values.uu = t.url
//       const wrap = mountUrl()
//
//       const l = wrap.find(t.tag)
//       expect(l.attributes().href, t.name).to.eq(t.expected.url)
//       expect(l.text(), t.name).to.eq(t.expected.label)
//     }
//   })
//
//   it('should allow multi-value urls', () => {
//     const tests = [
//       {
//         name: 'multiple urls',
//         options: {},
//         tag: 'a',
//         url: [
//           'https://www.test.tld/url1',
//           'https://www.test.tld/url2',
//           'https://www.test.tld/url3',
//         ],
//         expected: [
//           {
//             url: 'https://www.test.tld/url1',
//             label: 'https://www.test.tld/url1',
//           },
//           {
//             url: 'https://www.test.tld/url2',
//             label: 'https://www.test.tld/url2',
//           },
//           {
//             url: 'https://www.test.tld/url3',
//             label: 'https://www.test.tld/url3',
//           },
//         ],
//       },
//
//       {
//         name: 'multiple urls as plain-text',
//         options: {
//           outputPlain: true,
//         },
//         tag: 'span',
//         url: [
//           'https://www.test.tld/url1',
//           'https://www.test.tld/url2',
//           'https://www.test.tld/url3',
//         ],
//         expected: [
//           {
//             url: undefined,
//             label: 'https://www.test.tld/url1',
//           },
//           {
//             url: undefined,
//             label: 'https://www.test.tld/url2',
//           },
//           {
//             url: undefined,
//             label: 'https://www.test.tld/url3',
//           },
//         ],
//       },
//     ]
//
//     for (const t of tests) {
//       propsData.field.options = t.options
//       propsData.field.isMulti = true
//       propsData.record.values.uu = t.url
//       const wrap = mountUrl()
//
//       const l = wrap.findAll(t.tag)
//       t.expected.forEach(({ url, label }, i) => {
//         expect(l.at(i).attributes().href).to.eq(url)
//         expect(l.at(i).text()).to.eq(label)
//       })
//     }
//   })
// })
