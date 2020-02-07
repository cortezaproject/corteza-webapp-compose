// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { extractSocialUrl, getTwitterHandle } from 'corteza-webapp-compose/src/lib/block/SocialFeed'
// import { compose } from '@cortezaproject/corteza-js'
//
// let should = require('chai').should()
//
// let mod = new compose.Module({
//   fields: [
//     {name: 'FirstName', kind: 'String'},
//     {name: 'LastName', kind: 'String'},
//     {name: 'TwitterProfile', kind: 'String'},
//   ]
// })
//
// let testRecord = new compose.Record(mod, {values: {
//   FirstName: 'Bob',
//   LastName: 'Stintsky',
//   TwitterProfile: 'https://twitter.com/zorosa',
// }})
//
// describe.skip('lib/block/SocialFeed.js', () => {
//   // Basic tests for missing Urls
//   it('Should not find anything from blank profileSourceField and profileUrl', function () {
//     let result = extractSocialUrl('', '', testRecord)
//
//     result.should.have.property('url').equal('')
//     result.should.have.property('socialNetwork').equal('')
//     result.should.have.property('twitterHandle').equal('')
//   })
//
//   it('Should not find anything from null profileSourceField and profileUrl', function () {
//     let result = extractSocialUrl(null, null, testRecord)
//
//     result.should.have.property('url').equal('')
//     result.should.have.property('socialNetwork').equal('')
//     result.should.have.property('twitterHandle').equal('')
//   })
//
//   // Twitter specific tests
//   it('Should find Twitter handle zorosa from url', () => {
//     expect(getTwitterHandle('https://twitter.com/zorosa')).to.equal('zorosa')
//   })
//
//   it('Should find Twitter handle zorosa from profileUrl', function () {
//     let result = extractSocialUrl('', 'https://twitter.com/zorosa', testRecord)
//
//     result.should.have.property('url').equal('https://twitter.com/zorosa')
//     result.should.have.property('socialNetwork').equal('Twitter')
//     result.should.have.property('twitterHandle').equal('zorosa')
//   })
//
//   it('Should find Twitter handle zorosa from profileSourceField', function () {
//     let result = extractSocialUrl('TwitterProfile', null, testRecord)
//
//     result.should.have.property('url').equal('https://twitter.com/zorosa')
//     result.should.have.property('socialNetwork').equal('Twitter')
//     result.should.have.property('twitterHandle').equal('zorosa')
//   })
//
//   it('Should not find a Twitter handle from profileSourceField - malformed url', function () {
//     let result = extractSocialUrl(null, 'https://twitter.com/profile/zorosa', testRecord)
//
//     result.should.have.property('url').equal('https://twitter.com/profile/zorosa')
//     result.should.have.property('socialNetwork').equal('')
//     result.should.have.property('twitterHandle').equal('')
//   })
// })
