// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import Feed from 'corteza-webapp-compose/src/lib/block/Calendar/feed'
// import { resources } from 'corteza-webapp-compose/src/lib/block/Calendar'
//
// describe('lib/block/Calendar/feed', () => {
//   describe('legacy views', () => {
//     it('convert old structure to the new one', () => {
//       const old = {
//         moduleID: '000',
//         startField: 'createdAt',
//         endField: 'end',
//         titleField: 'title',
//         allDay: false,
//       }
//       const expected = {
//         resource: resources.record,
//         options: {
//           moduleID: '000',
//         },
//         startField: 'createdAt',
//         endField: 'end',
//         allDay: false,
//         titleField: 'title',
//       }
//
//       expect(new Feed(old)).to.deep.eq(expected)
//     })
//
//     it('preserve new structure - determined with object keys', () => {
//       const old = {
//         resource: resources.record,
//         options: {
//           moduleID: '000',
//         },
//         startField: 'createdAt',
//         endField: 'end',
//         allDay: false,
//         titleField: 'title',
//       }
//
//       const expected = {
//         resource: resources.record,
//         options: {
//           moduleID: '000',
//         },
//         startField: 'createdAt',
//         endField: 'end',
//         allDay: false,
//         titleField: 'title',
//       }
//       expect(new Feed(old)).to.deep.eq(expected)
//     })
//   })
// })
