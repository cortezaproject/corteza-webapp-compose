// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { makeColors } from 'corteza-webapp-compose/src/lib/block/Calendar/feedLoader/colors'
//
// describe('src/lib/block/Calendar/feedLoader', () => {
//   describe('makeColors', () => {
//     it('determine event colors based on a base color', () => {
//       const tests = [
//         {
//           name: 'dark color',
//           color: '#636363',
//           expected: {
//             backgroundColor: 'rgba(99,99,99,0.7)',
//             borderColor: 'rgba(99,99,99,1)',
//             isLight: false,
//           }
//         },
//         {
//           name: 'dark color - on edge',
//           color: '#646464',
//           expected: {
//             backgroundColor: 'rgba(100,100,100,0.7)',
//             borderColor: 'rgba(100,100,100,1)',
//             isLight: false,
//           }
//         },
//         {
//           name: 'light color - on edge',
//           color: '#656565',
//           expected: {
//             backgroundColor: 'rgba(101,101,101,0.7)',
//             borderColor: 'rgba(101,101,101,1)',
//             isLight: true,
//           }
//         },
//         {
//           name: 'light color',
//           color: '#666666',
//           expected: {
//             backgroundColor: 'rgba(102,102,102,0.7)',
//             borderColor: 'rgba(102,102,102,1)',
//             isLight: true,
//           }
//         },
//       ]
//
//       for (const t of tests) {
//         const rr = makeColors(t.color)
//         expect(rr, t.name).to.deep.eq(t.expected)
//       }
//     })
//   })
// })
