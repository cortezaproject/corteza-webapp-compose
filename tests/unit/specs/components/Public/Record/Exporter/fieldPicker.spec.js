/* eslint-disable */
import { expect } from 'chai'
import FieldPicker from 'corteza-webapp-compose/src/components/Public/Record/Exporter/FieldPicker'
import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
import moment from 'moment'
import { compose } from '@cortezaproject/corteza-js'

describe('components/Public/Record/Exporter/FieldPicker.vue', () => {
  const mm = () => moment("2019-08-22")
  let propsData
  beforeEach(() => {
    propsData = {
      module: new compose.Module(),
    }
  })

  const mountExporter = (opt) => shallowMount(FieldPicker, {
    propsData,
    ...opt,
  })

  describe('calculate date ranges', () => {
    const cases = [
      {
        range: 'lastMonth',
        start: '2019-07-01',
        end: '2019-07-31',
      },
      {
        range: 'thisMonth',
        start: '2019-08-01',
        end: '2019-08-31',
      },
      {
        range: 'lastWeek',
        start: '2019-08-11',
        end: '2019-08-17',
      },
      {
        range: 'thisWeek',
        start: '2019-08-18',
        end: '2019-08-24',
      },
      {
        range: 'today',
        start: '2019-08-22',
        end: '2019-08-22',
      },
    ]

    it('range start', () => {
      for (const tc of cases) {
        expect(FieldPicker.methods.calcStart(mm(), tc.range)).to.eq(tc.start)
      }
    })

    it('range end', () => {
      for (const tc of cases) {
        expect(FieldPicker.methods.calcEnd(mm(), tc.range)).to.eq(tc.end)
      }
    })
  })

  describe('prep export request payload', () => {
    it('no filter', () => {
      propsData.fields = [
        { name: 'f1' },
        { name: 'f2' },
      ]
      const wrap = mountExporter()

      expect(wrap.emitted().export).to.be.undefined
      wrap.vm.doExport('kind')
      const e = wrap.emitted().export.pop().pop()
      expect(e).to.have.keys(['ext', 'fields', 'filters', 'filterRaw', 'timezone'])
    })

    it('filter', () => {
      let cases = [
        [
          {
            rangeType: 'all',
          },
          undefined,
        ],
        [
          {
            rangeType: 'range',
            rangeBy: 'created_at',
            date: { start: 'start', end: null }
          },
          'DATE(created_at)>=\'start\'',
        ],
        [
          {
            rangeType: 'range',
            rangeBy: 'updated_at',
            date: { start: null, end: 'end' }
          },
          'DATE(updated_at)<=\'end\'',
        ],
        [
          {
            rangeBy: 'updated_at',
            date: { start: 'start', end: 'end' }
          },
          '(DATE(updated_at)>=\'start\') AND (DATE(updated_at)<=\'end\')',
        ],
      ]

      const wrap = mountExporter()

      for (const [filter, expected] of cases) {
        wrap.setData({ filter })
        wrap.vm.doExport()
        const e = wrap.emitted().export.pop().pop()
        expect(e.filters).to.eq(expected)
      }
    })
  })

  it('determine if export disabled', () => {
    let cases = [
      [[], 0, true, true],
      [[], 1, true, true],
      [[ {} ], 0, true, true],
      [[ {} ], 1, true, false],
    ]
    for (const [ fields, recordCount, dateRangeValid, expected ] of cases) {
      expect(FieldPicker.computed.exportDisabled
          .call({ fields, recordCount, dateRangeValid })).to.eq(expected)
    }
  })

  it('date-range validation', () => {
    const tests = [
      {
        name: 'valid range',
        state: {
          start: '2019-10-29',
          end: '2019-10-30',
        },
        expected: true,
      },
      {
        name: 'valid range - larger step',
        state: {
          start: '2019-10-29',
          end: '2020-01-01',
        },
        expected: true,
      },
      {
        name: 'valid range - same date',
        state: {
          start: '2019-10-30',
          end: '2019-10-30',
        },
        expected: true,
      },
      {
        name: 'invalid range',
        state: {
          start: '2019-10-31',
          end: '2019-10-30',
        },
        expected: false,
      },
      {
        name: 'invalid range - larger step',
        state: {
          start: '2020-01-01',
          end: '2019-10-30',
        },
        expected: false,
      },
    ]

    for (const t of tests) {
      expect(FieldPicker.computed.dateRangeValid.call(t.state), t.name).to.eq(t.expected)
    }
  })

  describe('set date filters', () => {
    it('initial: start date', () => {
      propsData.startDate = mm().format()
      const wrap = mountExporter()

      expect(wrap.vm.start).to.not.be.null
      expect(wrap.vm.end).to.be.null
      expect(wrap.vm.range).to.eq('custom')
    })

    it('initial: end date', () => {
      propsData.endDate = mm().format()
      const wrap = mountExporter()

      expect(wrap.vm.start).to.be.null
      expect(wrap.vm.end).to.not.be.null
      expect(wrap.vm.range).to.eq('custom')
    })

    it('initial: start & end date', () => {
      propsData.startDate = mm().format()
      propsData.endDate = mm().format()
      const wrap = mountExporter()

      expect(wrap.vm.start).to.not.be.null
      expect(wrap.vm.end).to.not.be.null
      expect(wrap.vm.range).to.eq('custom')
    })

    it('initial: date range', () => {
      const wrap = mountExporter()

      expect(wrap.vm.start).to.not.be.null
      expect(wrap.vm.end).to.not.be.null
      expect(wrap.vm.range).to.not.eq('custom')
    })
  })
})
