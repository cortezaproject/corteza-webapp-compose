/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import { trimUrlFragment, trimUrlQuery, trimUrlPath, onlySecureUrl } from '@/lib/field/Url'

var should = require('chai').should()

describe('lib/field/Url.js', () => {
  // Test trimUrlFragment
  it('trimUrlFragment - Should remove # from the url', function () {
    var result = trimUrlFragment('http://example.tld/basic.html#testAnchor')
    result.should.equal('http://example.tld/basic.html')
  })
  it('trimUrlFragment - Should not change the url', function () {
    var result = trimUrlFragment('https://example.tld')
    result.should.equal('https://example.tld')
  })
  it('trimUrlFragment - Should not remove the query', function () {
    var result = trimUrlFragment('http://example.tld/basic.html?id=123')
    result.should.equal('http://example.tld/basic.html?id=123')
  })
  it('trimUrlFragment - Should not remove the extra path from the url', function () {
    var result = trimUrlFragment('http://example.tld/basic/index.html')
    result.should.equal('http://example.tld/basic/index.html')
  })

  // Test trimUrlQuery
  it('trimUrlQuery - Should not remove # from the url', function () {
    var result = trimUrlQuery('http://example.tld/basic.html#testAnchor')
    result.should.equal('http://example.tld/basic.html#testAnchor')
  })
  it('trimUrlQuery - Should not change the url', function () {
    var result = trimUrlQuery('https://example.tld')
    result.should.equal('https://example.tld')
  })
  it('trimUrlQuery - Should remove the query', function () {
    var result = trimUrlQuery('http://example.tld/basic.html?id=123')
    result.should.equal('http://example.tld/basic.html')
  })
  it('trimUrlQuery - Should not remove the extra path from the url', function () {
    var result = trimUrlQuery('http://example.tld/basic/index.html')
    result.should.equal('http://example.tld/basic/index.html')
  })

  // Test trimUrlPath
  it('trimUrlPath - Should remove # from the url', function () {
    var result = trimUrlPath('http://example.tld/basic.html#testAnchor')
    result.should.equal('http://example.tld')
  })
  it('trimUrlPath - Should not change the url', function () {
    var result = trimUrlPath('https://example.tld')
    result.should.equal('https://example.tld')
  })
  it('trimUrlPath - Should remove the query', function () {
    var result = trimUrlPath('http://example.tld/basic.html?id=123')
    result.should.equal('http://example.tld')
  })
  it('trimUrlPath - Should remove the extra path from the url', function () {
    var result = trimUrlPath('http://example.tld/basic/index.html')
    result.should.equal('http://example.tld')
  })

  // Test onlySecureUrl
  it('onlySecureUrl - Should not remove # from the url and turn it secure', function () {
    var result = onlySecureUrl('http://example.tld/basic.html#testAnchor')
    result.should.equal('https://example.tld/basic.html#testAnchor')
  })
  it('onlySecureUrl - Should not change the url', function () {
    var result = onlySecureUrl('https://example.tld')
    result.should.equal('https://example.tld')
  })
  it('onlySecureUrl - Should not remove the query and turn it secure', function () {
    var result = onlySecureUrl('http://example.tld/basic.html?id=123')
    result.should.equal('https://example.tld/basic.html?id=123')
  })
  it('onlySecureUrl - Should not remove the extra path from the url and turn it secure', function () {
    var result = onlySecureUrl('http://example.tld/basic/index.html')
    result.should.equal('https://example.tld/basic/index.html')
  })

})
