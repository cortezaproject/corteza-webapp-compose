// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { trimUrlFragment, trimUrlQuery, trimUrlPath, onlySecureUrl } from 'corteza-webapp-compose/src/lib/field/Url'
//
// describe.skip('lib/field/Url.js', () => {
//   it('trim URL fragment', () => {
//     const tests = [
//       {
//         name: 'invalid value - undefined',
//         url: undefined,
//         expected: undefined,
//       },
//       {
//         name: 'invalid value - empty string',
//         url: '',
//         expected: '',
//       },
//       {
//         name: 'partial url - missing schema',
//         url: 'example.tld/',
//         expected: 'https://example.tld/',
//       },
//       {
//         name: 'remove fragment',
//         url: 'http://example.tld/basic/index.html?q1=v1#testAnchor',
//         expected: 'http://example.tld/basic/index.html?q1=v1',
//       },
//
//       {
//         name: 'leave as is, if no fragment provided',
//         url: 'https://example.tld/',
//         expected: 'https://example.tld/',
//       },
//
//       {
//         name: 'leave as is, if no fragment provided - with path & query',
//         url: 'http://example.tld/basic/index.html?q1=v1',
//         expected: 'http://example.tld/basic/index.html?q1=v1',
//       },
//     ]
//
//     for (const t of tests) {
//       expect(trimUrlFragment(t.url), t.name).to.eq(t.expected)
//     }
//   })
//
//   it('trimUrlQuery', () => {
//     const tests = [
//       {
//         name: 'invalid value - undefined',
//         url: undefined,
//         expected: undefined,
//       },
//       {
//         name: 'invalid value - empty string',
//         url: '',
//         expected: '',
//       },
//       {
//         name: 'partial url - missing schema',
//         url: 'example.tld/',
//         expected: 'https://example.tld/',
//       },
//       {
//         name: 'remove query',
//         url: 'http://example.tld/basic/index.html?q1=v1#testAnchor',
//         expected: 'http://example.tld/basic/index.html#testAnchor',
//       },
//
//       {
//         name: 'remove multiple query params',
//         url: 'http://example.tld/basic/index.html?q1=v1&q2=v2&q3=v3#testAnchor',
//         expected: 'http://example.tld/basic/index.html#testAnchor',
//       },
//
//       {
//         name: 'leave as is, if no query provided',
//         url: 'https://example.tld/',
//         expected: 'https://example.tld/',
//       },
//
//       {
//         name: 'leave as is, if no query provided - with path & hash',
//         url: 'http://example.tld/basic/index.html#testAnchor',
//         expected: 'http://example.tld/basic/index.html#testAnchor',
//       },
//     ]
//
//     for (const t of tests) {
//       expect(trimUrlQuery(t.url), t.name).to.eq(t.expected)
//     }
//   })
//
//   it('trimUrlPath', () => {
//     const tests = [
//       {
//         name: 'invalid value - undefined',
//         url: undefined,
//         expected: undefined,
//       },
//       {
//         name: 'invalid value - empty string',
//         url: '',
//         expected: '',
//       },
//       {
//         name: 'partial url - missing schema',
//         url: 'example.tld/',
//         expected: 'https://example.tld/',
//       },
//       {
//         name: 'remove path',
//         url: 'http://example.tld/basic/index.html?q1=v1#testAnchor',
//         expected: 'http://example.tld/?q1=v1#testAnchor',
//       },
//
//       {
//         name: 'leave as is, if no path provided',
//         url: 'https://example.tld/',
//         expected: 'https://example.tld/',
//       },
//
//       {
//         name: 'leave as is, if no path provided - with path & hash',
//         url: 'http://example.tld/?q1=v1#testAnchor',
//         expected: 'http://example.tld/?q1=v1#testAnchor',
//       },
//     ]
//
//     for (const t of tests) {
//       expect(trimUrlPath(t.url), t.name).to.eq(t.expected)
//     }
//   })
//
//   it('onlySecureUrl', () => {
//     const tests = [
//       {
//         name: 'invalid value - undefined',
//         url: undefined,
//         expected: undefined,
//       },
//       {
//         name: 'invalid value - empty string',
//         url: '',
//         expected: '',
//       },
//       {
//         name: 'partial url - missing schema',
//         url: 'example.tld/',
//         expected: 'https://example.tld/',
//       },
//       {
//         name: 'securify',
//         url: 'http://example.tld/basic/index.html?q1=v1#testAnchor',
//         expected: 'https://example.tld/basic/index.html?q1=v1#testAnchor',
//       },
//
//       {
//         name: 'leave as is if secure',
//         url: 'https://example.tld/',
//         expected: 'https://example.tld/',
//       },
//
//       {
//         name: 'leave as is, if secure - with path, query & hash',
//         url: 'https://example.tld/basic/index.html?q1=v1#testAnchor',
//         expected: 'https://example.tld/basic/index.html?q1=v1#testAnchor',
//       },
//     ]
//
//     for (const t of tests) {
//       expect(onlySecureUrl(t.url), t.name).to.eq(t.expected)
//     }
//   })
// })
