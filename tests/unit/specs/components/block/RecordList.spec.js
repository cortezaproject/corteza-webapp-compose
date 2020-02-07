// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import sinon from 'sinon'
// import { RecordList } from 'corteza-webapp-compose/src/lib/block/RecordList'
//
// let should = require('chai').should()
//
// describe.skip('lib/block/RecordList.js', () => {
//   it('Should fetch recordList', () => {
//
//     let recordListModule = new compose.Module({
//       moduleID: '1',
//       namespaceID: '1'
//     })
//
//     let filter = {
//       count: 0,
//       page: 0,
//       perPage: 20,
//       sort: '',
//       filter: '',
//     }
//
//     let rl = new RecordList({
//       moduleID: '1',
//     })
//
//     let $ComposeAPI = {
//       recordList: sinon.fake.resolves({ filter: {}, set: [] }),
//     }
//
//     rl.fetch($ComposeAPI, recordListModule, filter).then(r => {
//       sinon.assert.calledWith($ComposeAPI.recordList, { moduleID: '1', namespaceID: '1', ...filter })
//     })
//   })
// })
