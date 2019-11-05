/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
import Calendar from 'corteza-webapp-compose/src/lib/block/View/Calendar'
import FullCalendar from '@fullcalendar/vue'
import Module from 'corteza-webapp-compose/src/lib/module'
import sinon from 'sinon'
import moment from 'moment'
import fp from 'flush-promises'

describe('lib/block/View/Calendar', () => {
  beforeEach(() => {
    sinon.stub(Calendar.watch, 'boundingRect.height').get(() => { handler: () => {} })
  })

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

  const mountCalendar = (opt) => shallowMount(Calendar, {
    mocks: { $ComposeAPI },
    propsData,
    ...opt,
  })

  describe('generate config', () => {
    it('bail if calendar not initialized', () => {
      sinon.stub(Calendar, 'watch').get(() => {})
      const wrap = mountCalendar()

      expect(wrap.find(FullCalendar).exists()).to.be.false
    })

    it('generate', () => {
      const wrap = mountCalendar()

      const c = wrap.find(FullCalendar)
      const p = c.props()
      expect(c.exists()).to.be.true
      expect(p.header).to.not.be.undefined
    })
  })

  describe('event loading', () => {
    const mkM = (moduleID = '000') => new Module({ moduleID, fields: [{ name: 'start', kind:'DateTime' }, { name: 'end', kind:'DateTime' }] })

    it('bail if date ranges not defined', async () => {
      const tests = [
        { name: 'start not defined', params: [] },
        { name: 'end not defined', params: [ new Date() ] },
      ]

      for (const t of tests) {
        const wrap = mountCalendar()
        wrap.vm.loadEvents(...t.params)

        const c = wrap.find(Calendar)
        expect(c.props().events, t.name).to.be.undefined
      }
    })

    it('bail if date ranges are preserved', async () => {
      const start = moment('2000-01-01T01:01:01.000Z')
      const end = moment('2000-02-01T01:01:01.000Z')
      const tests = [
        { name: 'ranges are equal', params: [ start, end ] },
      ]

      for (const t of tests) {
        const wrap = mountCalendar()
        wrap.setData({ loaded: { start, end } })
        wrap.vm.loadEvents(...t.params)

        const c = wrap.find(Calendar)
        expect(c.props().events, t.name).to.be.undefined
      }
    })

    it('build recordList filter based on fields', async () => {
      const tests = [
        {
          name: 'start and end provided',
          feed: { moduleID: '000', endField: 'end', startField: 'start', titleField: 'title', allDay: false },
          expect: () => {
            const rlp = $ComposeAPI.recordList.args[0][0]
            expect(rlp.filter).to.include('date(start) >=')
            expect(rlp.filter).to.include('date(end) <')
          }
        },
        {
          name: 'end not provided',
          feed: { moduleID: '000', startField: 'start', titleField: 'title', allDay: false },
          expect: () => {
            const rlp = $ComposeAPI.recordList.args[0][0]
            expect(rlp.filter).to.include('date(start) >=')
            expect(rlp.filter).to.include('date(start) <')
          }
        },
      ]

      const start = moment()
      const end = moment()
      for (const t of tests) {
        sinon.stub(Calendar.methods, 'findModuleByID').resolves(mkM())
        $ComposeAPI.recordList = sinon.stub().resolves({ set: [ { recordID: '100', values: { start: 'd1', end: 'd2' } } ] })
        propsData.options.feeds = [ t.feed ]
        const wrap = mountCalendar()
        sinon.stub(wrap.vm, 'pages').get(() => ([]))
        wrap.vm.loadEvents(start, end)

        await fp()
        t.expect()
        Calendar.methods.findModuleByID.restore()
      }
    })

    it('build fc events', async () => {
      propsData.options.feeds = [
        { moduleID: '000', endField: 'end', startField: 'start', titleField: 'title', allDay: false },
      ]

      sinon.stub(Calendar.methods, 'findModuleByID').resolves(mkM())
      $ComposeAPI.recordList = sinon.stub().resolves({ set: [ { recordID: '100', values: { start: 'd1' } } ] })
      const wrap = mountCalendar()
      sinon.stub(wrap.vm, 'pages').get(() => ([]))

      const start = moment()
      const end = moment()
      wrap.vm.loadEvents(start, end)

      await fp()

      const c = wrap.find(FullCalendar)
      const p = c.props()
      const evt = p.events.pop()
      expect(evt).to.include.keys('id', 'start', 'end', 'extendedProps')
      expect(evt.extendedProps).to.include.keys('recordID', 'pageID')
    })

    it('loading from multiple feeds', async () => {
      propsData.options.feeds = [
        { moduleID: '000', endField: 'end', startField: 'start', titleField: 'title', allDay: false },
        { moduleID: '001', endField: 'end', startField: 'start', titleField: 'title', allDay: true },
      ]

      sinon.stub(Calendar.methods, 'findModuleByID')
      Calendar.methods.findModuleByID.onCall(0).resolves(mkM())
      Calendar.methods.findModuleByID.onCall(1).resolves(mkM('001'))

      $ComposeAPI.recordList = sinon.stub()
      $ComposeAPI.recordList.onCall(0).resolves({ set: [ { recordID: '100', values: { start: 'd1' } } ] })
      $ComposeAPI.recordList.onCall(1).resolves({ set: [ { recordID: '101', values: { start: 'd2' } }, { recordID: '102', values: { start: 'd3' } } ] })

      const wrap = mountCalendar()
      sinon.stub(wrap.vm, 'pages').get(() => ([]))
      const start = moment()
      const end = moment()
      wrap.vm.loadEvents(start, end)

      await fp()
      const c = wrap.find(FullCalendar)
      const ee = c.props().events
      expect(ee).to.not.be.undefined
      expect(ee).to.have.length(3)

      // 2nd run, shouldn't fetch data
      // v will fail, if it attempts to run
      wrap.vm.loadEvents(start, end)
      await fp()
    })

    it('events with multi-field values', async () => {
      const tests = [
        {
          name: 'make n events with start only',
          feed: { moduleID: '000', startField: 'start', titleField: 'title', allDay: false },
          records: [ { recordID: '100', values: { start: ['d1', 'd2'], end: undefined } } ],
          expect: function (c) {
            const evts = c.props().events
            expect(evts, this.name).to.have.length(2)

            expect(evts[0], this.name).to.include({ groupId: '100' })
            expect(evts[0], this.name).to.include({ start: 'd1' })
            expect(evts[0], this.name).to.include({ end: null })

            expect(evts[1], this.name).to.include({ groupId: '100' })
            expect(evts[1], this.name).to.include({ start: 'd2' })
            expect(evts[1], this.name).to.include({ end: null })
          },
        },
        {
          name: 'no events, since no start fields',
          feed: { moduleID: '000', endField: 'end', titleField: 'title', allDay: false },
          records: [ { recordID: '100', values: { start: undefined, end: ['d1', 'd2'] } } ],
          expect: function (c) {
            expect(c.props().events, this.name).to.have.length(0)
          },
        },
        {
          name: 'match available start fields with end fields',
          feed: { moduleID: '000', startField: 'start', endField: 'end', titleField: 'title', allDay: false },
          records: [ { recordID: '100', values: { start: ['d1', 'd2'], end: ['d3'] } } ],
          expect: function (c) {
            const evts = c.props().events
            expect(evts, this.name).to.have.length(2)

            expect(evts[0], this.name).to.include({ groupId: '100' })
            expect(evts[0], this.name).to.include({ start: 'd1' })
            expect(evts[0], this.name).to.include({ end: 'd3' })

            expect(evts[1], this.name).to.include({ groupId: '100' })
            expect(evts[1], this.name).to.include({ start: 'd2' })
            expect(evts[1], this.name).to.include({ end: null })
          },
        },
        {
          name: 'allow system values',
          feed: { moduleID: '000', startField: 'createdAt', endField: 'deletedAt', titleField: 'title', allDay: false },
          records: [ { recordID: '100', createdAt: '2000-01-01T00:00:00Z', deletedAt: '2001-01-01T00:00:00Z', values: { start: undefined, end: undefined } } ],
          expect: function (c) {
            const evts = c.props().events
            expect(evts, this.name).to.have.length(1)

            expect(evts[0], this.name).to.include({ start: '2000-01-01T00:00:00Z' })
            expect(evts[0], this.name).to.include({ end: '2001-01-01T00:00:00Z' })
          },
        },
        {
          name: 'allow system values - no end',
          feed: { moduleID: '000', startField: 'createdAt', endField: 'deletedAt', titleField: 'title', allDay: false },
          records: [ { recordID: '100', createdAt: '2000-01-01T00:00:00Z', values: { start: undefined, end: undefined } } ],
          expect: function (c) {
            const evts = c.props().events
            expect(evts, this.name).to.have.length(1)

            expect(evts[0], this.name).to.include({ start: '2000-01-01T00:00:00Z' })
            expect(evts[0], this.name).to.include({ end: null })
          },
        },
        {
          name: 'allow system values - no start',
          feed: { moduleID: '000', startField: 'createdAt', endField: 'deletedAt', titleField: 'title', allDay: false },
          records: [ { recordID: '100', values: { start: undefined, end: undefined } } ],
          expect: function (c) {
            expect(c.props().events, this.name).to.have.length(0)
          },
        },
        {
          name: 'allow mix system & multi field values',
          feed: { moduleID: '000', startField: 'createdAt', endField: 'end', titleField: 'title', allDay: false },
          records: [ { recordID: '100', createdAt: '2000-01-01T00:00:00Z', values: { start: undefined, end: ['d1', 'd2'] } } ],
          expect: function (c) {
            const evts = c.props().events
            expect(evts, this.name).to.have.length(1)

            expect(evts[0], this.name).to.include({ start: '2000-01-01T00:00:00Z' })
            expect(evts[0], this.name).to.include({ end: 'd1' })
          },
        },
      ]

      const start = moment()
      const end = moment()
      for (const t of tests) {
        sinon.stub(Calendar.methods, 'findModuleByID').resolves(new Module({ moduleID: '000', fields: [{ name: 'start', kind:'DateTime', isMulti: true }, { name: 'end', kind:'DateTime', isMulti: true }] }))
        $ComposeAPI.recordList = sinon.stub().resolves({ set: t.records })
        propsData.options.feeds = [ t.feed ]
        const wrap = mountCalendar()
        sinon.stub(wrap.vm, 'pages').get(() => ([]))
        wrap.vm.loadEvents(start, end)

        await fp()
        const c = wrap.find(FullCalendar)
        t.expect(c, t)
        Calendar.methods.findModuleByID.restore()
      }
    })
  })

  it('handle event click', () => {
    const tests = [
      {
        name: 'valid event - redirect',
        event: { extendedProps: { recordID: '000', pageID: '200' } },
        expect: function ({ $router }) {
          sinon.assert.calledOnce($router.push)
        },
      },
      {
        name: 'malformed event - no recordID - ignore',
        event: { extendedProps: { pageID: '200' } },
        expect: function ({ $router }) {
          sinon.assert.notCalled($router.push)
        },
      },
      {
        name: 'malformed event - no pageID - ignore',
        event: { extendedProps: { recordID: '000' } },
        expect: function ({ $router }) {
          sinon.assert.notCalled($router.push)
        },
      },
    ]

    for (const t of tests) {
      const $router = {
        push: sinon.fake()
      }
      const wrap = mountCalendar({ mocks: { $router, $ComposeAPI } })
      wrap.vm.handleEventClick({ event: t.event })
      t.expect({ $router })
    }
  })
})
