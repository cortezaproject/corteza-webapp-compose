/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import RecordList from 'corteza-webapp-compose/src/lib/block/View/RecordList'
import Module from 'corteza-webapp-compose/src/lib/module'
import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
import sinon from 'sinon'

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
  let propsData, $ComposeAPI
  beforeEach(() => {
    propsData = {
      options: {},
      page: {},
      namespace: {},
    }
    $ComposeAPI = {
      recordList: sinon.mock().resolves({ set: [], filter: {} })
    }
  })
  afterEach(() => {
    sinon.restore()
  })

  const mountRL = (opt) => shallowMount(RecordList, {
    mocks: { $ComposeAPI },
    propsData,
    ...opt,
  })

  describe('records', () => {
    beforeEach(() => {
      sinon.stub(RecordList, 'beforeMount')
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
})
