// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { Select } from 'corteza-webapp-compose/src/lib/field/Select'
//
// describe.skip('lib/field/Select.js', () => {
//   it('pre-process select options', () => {
//     const tests = [
//       {
//         name: 'handle legacy - text values',
//         options: ['opt1', 'opt2'],
//         expected: [{ value: 'opt1', text: 'opt1' }, { value: 'opt2', text: 'opt2' }],
//       },
//
//       {
//         name: 'handle valid values',
//         options: [{ value: 'opt1', text: 'opt1' }, { value: 'opt2', text: 'opt2' }],
//         expected: [{ value: 'opt1', text: 'opt1' }, { value: 'opt2', text: 'opt2' }],
//       },
//       {
//         name: 'handle case where text is not defined',
//         options: [{ value: 'opt1' }, { value: 'opt2' }],
//         expected: [{ value: 'opt1', text: 'opt1' }, { value: 'opt2', text: 'opt2' }],
//       },
//     ]
//
//     for (const t of tests) {
//       const s = new Select(t)
//       expect(s.options, t.name).to.deep.eq(t.expected)
//     }
//   })
// })
