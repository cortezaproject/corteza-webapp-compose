// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import Field from 'corteza-webapp-compose/src/lib/field/index.js'
//
// describe.skip('lib/field/index.js', () => {
//   it('validate value', () => {
//     let test = [
//       // value, is required, expected length
//       // single values
//       ['', false, 0],
//       ['', true, 1],
//       ['v', false, 0],
//       ['v', true, 0],
//       [true, false, 0],
//       [true, true, 0],
//       [false, false, 0],
//       [false, true, 0],
//       [0, false, 0],
//       [0, true, 0],
//
//       // multi values
//       [[], false, 0],
//       [[], true, 1],
//       [[''], false, 0],
//       [[''], true, 1],
//       [['v'], false, 0],
//       [['v'], true, 0],
//       [[true], false, 0],
//       [[true], true, 0],
//       [[false], false, 0],
//       [[false], true, 0],
//       [[0], false, 0],
//       [[0], true, 0],
//     ]
//
//     const fnc = Field.prototype.validate
//     for (const [ v, isRequired, exp ] of test) {
//       expect((fnc.bind({ isRequired, options: {} }))(v)).to.have.length(exp)
//     }
//   })
// })
