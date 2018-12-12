/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import { trimUrlFragment, trimUrlQuery, trimUrlPath, onlySecureUrl } from '@/lib/field/Url'

var should = require('chai').should()

describe('field/Url.js', () => {

  // Test trimUrlFragment
  it('trimUrlFragment - Should remove # from the url', function () {
    var result = trimUrlFragment('http://www.crust.tech/basic.html#testAnchor')
    result.should.equal('http://www.crust.tech/basic.html')
  })
  it('trimUrlFragment - Should not change the url', function () {
    var result = trimUrlFragment('https://www.crust.tech')
    result.should.equal('https://www.crust.tech')
  })
  it('trimUrlFragment - Should not remove the query', function () {
    var result = trimUrlFragment('http://www.crust.tech/basic.html?id=123')
    result.should.equal('http://www.crust.tech/basic.html?id=123')
  })
  it('trimUrlFragment - Should not remove the extra path from the url', function () {
    var result = trimUrlFragment('http://www.crust.tech/basic/index.html')
    result.should.equal('http://www.crust.tech/basic/index.html')
  })

  // Test trimUrlQuery
  it('trimUrlQuery - Should not remove # from the url', function () {
    var result = trimUrlQuery('http://www.crust.tech/basic.html#testAnchor')
    result.should.equal('http://www.crust.tech/basic.html#testAnchor')
  })
  it('trimUrlQuery - Should not change the url', function () {
    var result = trimUrlQuery('https://www.crust.tech')
    result.should.equal('https://www.crust.tech')
  })
  it('trimUrlQuery - Should remove the query', function () {
    var result = trimUrlQuery('http://www.crust.tech/basic.html?id=123')
    result.should.equal('http://www.crust.tech/basic.html')
  })
  it('trimUrlQuery - Should not remove the extra path from the url', function () {
    var result = trimUrlQuery('http://www.crust.tech/basic/index.html')
    result.should.equal('http://www.crust.tech/basic/index.html')
  })

  // Test trimUrlPath
  it('trimUrlPath - Should remove # from the url', function () {
    var result = trimUrlPath('http://www.crust.tech/basic.html#testAnchor')
    result.should.equal('http://www.crust.tech')
  })
  it('trimUrlPath - Should not change the url', function () {
    var result = trimUrlPath('https://www.crust.tech')
    result.should.equal('https://www.crust.tech')
  })
  it('trimUrlPath - Should remove the query', function () {
    var result = trimUrlPath('http://www.crust.tech/basic.html?id=123')
    result.should.equal('http://www.crust.tech')
  })
  it('trimUrlPath - Should remove the extra path from the url', function () {
    var result = trimUrlPath('http://www.crust.tech/basic/index.html')
    result.should.equal('http://www.crust.tech')
  })

  // Test onlySecureUrl
  it('onlySecureUrl - Should not remove # from the url and turn it secure', function () {
    var result = onlySecureUrl('http://www.crust.tech/basic.html#testAnchor')
    result.should.equal('https://www.crust.tech/basic.html#testAnchor')
  })
  it('onlySecureUrl - Should not change the url', function () {
    var result = onlySecureUrl('https://www.crust.tech')
    result.should.equal('https://www.crust.tech')
  })
  it('onlySecureUrl - Should not remove the query and turn it secure', function () {
    var result = onlySecureUrl('http://www.crust.tech/basic.html?id=123')
    result.should.equal('https://www.crust.tech/basic.html?id=123')
  })
  it('onlySecureUrl - Should not remove the extra path from the url and turn it secure', function () {
    var result = onlySecureUrl('http://www.crust.tech/basic/index.html')
    result.should.equal('https://www.crust.tech/basic/index.html')
  })

})
