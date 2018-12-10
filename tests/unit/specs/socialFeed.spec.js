/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import { extractSocialUrl, getTwitterHandle } from '@/lib/block/SocialFeed'

var should = require('chai').should()

describe('SocialFeed.js', () => {

  // Basic tests for missing Urls
  it('Should not find anything from blank profileSourceField and profileUrl', function () {
    var result = extractSocialUrl({
      profileUrl: '',
      profileSourceField: '',
    })

    result.should.have.property('url').equal('')
    result.should.have.property('socialNetwork').equal('')
    result.should.have.property('twitterHandle').equal('')
  })

  it('Should not find anything from null profileSourceField and profileUrl', function () {
    var result = extractSocialUrl({
      profileUrl: null,
      profileSourceField: null,
    })

    result.should.have.property('url').equal('')
    result.should.have.property('socialNetwork').equal('')
    result.should.have.property('twitterHandle').equal('')
  })

  // Twitter specific tests
  it('Should find Twitter handle zorosa from url', () => {
    expect(getTwitterHandle('https://twitter.com/zorosa')).to.equal('zorosa')
  })

  it('Should find Twitter handle zorosa from profileUrl', function () {
    var result = extractSocialUrl({
      profileUrl: 'https://twitter.com/zorosa',
      profileSourceField: null,
    })

    result.should.have.property('url').equal('https://twitter.com/zorosa')
    result.should.have.property('socialNetwork').equal('Twitter')
    result.should.have.property('twitterHandle').equal('zorosa')
  })

  it('Should find Twitter handle zorosa from profileSourceField', function () {
    var result = extractSocialUrl({
      profileUrl: null,
      profileSourceField: 'https://twitter.com/zorosa',
    })

    result.should.have.property('url').equal('https://twitter.com/zorosa')
    result.should.have.property('socialNetwork').equal('Twitter')
    result.should.have.property('twitterHandle').equal('zorosa')
  })

  it('Should not find a Twitter handle from profileSourceField - malformed url', function () {
    var result = extractSocialUrl({
      profileUrl: null,
      profileSourceField: 'https://twitter.com/profile/zorosa',
    })

    result.should.have.property('url').equal('https://twitter.com/profile/zorosa')
    result.should.have.property('socialNetwork').equal('')
    result.should.have.property('twitterHandle').equal('')
  })
})
