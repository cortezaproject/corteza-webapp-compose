/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import { formatNumber, formatNumberFull } from '@/lib/field/Number'

var should = require('chai').should()

describe('field/Number.js', () => {

  // Test formatNumber
  it('formatNumber - Should round down', function () {
    var result = formatNumber('', '3', '123.123333')
    result.should.equal('123.123')
  })
  it('formatNumber - Should round up', function () {
    var result = formatNumber('', '3', '123.123533')
    result.should.equal('123.124')
  })
  it('formatNumber - Should remove all decimals', function () {
    var result = formatNumber('', '0', '123.123533')
    result.should.equal('123')
  })
  it('formatNumber - Should pad decimals', function () {
    var result = formatNumber('', '2', '123')
    result.should.equal('123.00')
  })

  // Test formatNumberFull
  it('formatNumberFull - Should insert prefix', function () {
    var result = formatNumberFull('', '$ ', '', '2', '123.123333')
    result.should.equal('$ 123.12')
  })
  it('formatNumberFull - Should insert suffix', function () {
    var result = formatNumberFull('', '', 'kg', '2', '123.123533')
    result.should.equal('123.12kg')
  })
  it('formatNumberFull - Should insert prefix and suffix', function () {
    var result = formatNumberFull('', '$ ', ' mil', '0', '123.123533')
    result.should.equal('$ 123 mil')
  })
  it('formatNumberFull - Should pad decimals', function () {
    var result = formatNumberFull('', '', '', '2', '123')
    result.should.equal('123.00')
  })
  it('formatNumberFull - Insert thou seperator', function () {
    var result = formatNumberFull('0,0', '$ ', '', '2', '12345')
    result.should.equal('$ 12,345')
  })
  it('formatNumberFull - Insert thou seperator and decimal', function () {
    var result = formatNumberFull('0,0.00', '$ ', '', '2', '12345.12345')
    result.should.equal('$ 12,345.12')
  })

})
