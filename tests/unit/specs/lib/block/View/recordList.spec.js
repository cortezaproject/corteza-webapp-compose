/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import RecordList from 'corteza-webapp-compose/src/lib/block/View/RecordList'
import Module from 'corteza-webapp-compose/src/lib/module'
import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
import sinon from 'sinon'
import fp from 'flush-promises'

const records = [
  {recordID: '100', moduleID: '200', values: [{ name: 'n1', value: 'v1'},{ name: "n2", value: 'v2'}], namespaceID: '300' },
  {recordID: '101', moduleID: '200', values: [{ name: 'n1', value: 'v1'},{ name: "n2", value: 'v2'}], namespaceID: '301' },
]

let mod = new Module({
  moduleID: '200',
  fields: [
    {name: 'n1', kind: 'String'},
    {name: 'n2', kind: 'String'},
  ]
})


describe('lib/block/View/RecordList', () => {
  let propsData, $ComposeAPI, $auth
  beforeEach(() => {
    propsData = {
      options: {},
      page: {},
      namespace: {},
    }
    $auth = {
      user: { userID: '888' },
    }
    $ComposeAPI = {
      recordList: sinon.mock().resolves({ set: [], filter: {} })
    }
  })
  afterEach(() => {
    sinon.restore()
  })

  const mountRL = (opt) => shallowMount(RecordList, {
    mocks: { $ComposeAPI, $auth },
    propsData,
    ...opt,
  })

  describe('records', () => {
    beforeEach(() => {
      sinon.stub(RecordList, 'created')
    })

    it('Don\'t render any records if module is not defined', () => {
      $ComposeAPI.recordList = sinon.mock().resolves({ set: records })
      const wrap = mountRL()

      expect(wrap.findAll('table tbody tr')).to.have.length(0)
    })

    it('Render records if module comes in late', () => {
      // @todo improve this test
      let local = {
        recordListModule: mod,
        recordsRaw: records,
      }

      expect(RecordList.computed.records.call(local)).to.have.length(2)
    })
  })

  describe('record fetching', () => {
    beforeEach(() => {
      sinon.stub(RecordList.computed, 'recordListModule').returns(new Module({ moduleID: '333' }))
      propsData.options.pageID = '111'
      propsData.options.moduleID = '333'
    })

    const rspFilter = () => ({
      count: 2,
      page: 1,
      perPage: 20,
      sort: '',
      filter: '',
    })

    it('on init -- prepare initial filter', () => {
      sinon.stub(RecordList.methods, 'updateRecordList')
      const wrap = mountRL()

      expect(wrap.vm.filter).to.not.deep.eq({})
    })

    it('on init -- evaluate prefilter', () => {
      sinon.stub(RecordList.methods, 'updateRecordList')
      propsData.options.prefilter = '${userID} is awesome'
      const wrap = mountRL()

      expect(wrap.vm.filter.filter).to.include($auth.user.userID)
    })

    it('fetch records with initial query', async () => {
      $ComposeAPI.recordList = sinon.mock().resolves({ set: [], filter: rspFilter() })
      const wrap = mountRL()
      await fp()

      sinon.assert.calledOnce($ComposeAPI.recordList)
      expect(wrap.vm.filter).to.deep.eq(rspFilter())
    })
  })

  // @todo...
  describe('record filtering', () => {
    it('fallback to prefilter on empty query')
    it('make numeric query')
    it('make string query -- convert wildcards to sql wildcards')
    it('join field queries')
  })
})
