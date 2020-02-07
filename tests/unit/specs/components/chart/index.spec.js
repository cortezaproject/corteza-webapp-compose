// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { makeDataLabel } from 'corteza-webapp-compose/src/lib/chart'
//
// describe.skip('lib/chart/index.js', () => {
//   describe('make dataset data-labels', () => {
//     let value, dataset
//
//     beforeEach(() => {
//       value = 10
//       dataset = {
//         data: [10, 70],
//       }
//     })
//
//     it('abs value', () => {
//       dataset.type = 'line'
//       const test = makeDataLabel({
//         value,
//         dataset,
//       })
//       expect(test).to.include(value)
//       expect(test).to.not.include('%')
//     })
//
//     it('rel value', () => {
//       dataset.type = 'pie'
//       const test = makeDataLabel({
//         value,
//         dataset,
//         relativeValue: true,
//       })
//
//       // value should not be the same, since it is
//       // normalized
//       expect(test).to.not.include(value)
//       expect(test).to.include('%')
//     })
//
//     it('handle values with time dimensions', () => {
//       dataset.type = 'line'
//       const test = makeDataLabel({
//         value: { y: 10, t: new Date() },
//       })
//
//       expect(test).to.include('10')
//     })
//   })
// })
