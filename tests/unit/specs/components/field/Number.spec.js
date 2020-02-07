// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { Number } from 'corteza-webapp-compose/src/lib/field/Number'
//
// describe.skip('lib/field/Number.js', () => {
//   it('Should insert prefix', function () {
//     expect(new Number({format: '', prefix: '$ ', suffix: '', precision: 2}).formatValue('123.123333'))
//     .to.equal('$ 123.12')
//   })
//
//   it('Should insert suffix', function () {
//     expect(new Number({format: '', prefix: '', suffix: 'kg', precision: 2}).formatValue('123.123533'))
//     .to.equal('123.12kg')
//   })
//
//   it('Should insert prefix and suffix', function () {
//     expect(new Number({format: '', prefix: '$ ', suffix: ' mil', precision: 0}).formatValue('123.123533'))
//     .to.equal('$ 123 mil')
//   })
//
//   it('Should pad decimals', function () {
//     expect(new Number({format: '', prefix: '', suffix: '', precision: 2}).formatValue('123'))
//     .to.equal('123.00')
//   })
//
//   it('Insert thousands seperator', function () {
//     expect(new Number({format: '0,0', prefix: '$ ', suffix: '', precision: 2}).formatValue('12345'))
//     .to.equal('$ 12,345')
//   })
//
//   it('Insert thousands seperator and decimal', function () {
//     expect(new Number({format: '0,0.00', prefix: '$ ', suffix: '', precision: 2}).formatValue('12345.12345'))
//     .to.equal('$ 12,345.12')
//   })
// })
