/* eslint-disable */
import { expect } from 'chai'
import TheDeferredTriggers from 'corteza-webapp-compose/src/components/Admin/Automation/TheDeferredTriggers'
import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
import { DateTime, Interval, Confirm } from 'corteza-webapp-common/src/components/Input'
import AT from 'corteza-webapp-common/src/lib/types/shared/automation-trigger'

const resource = 'compose:record'
const stdTriggerList = () => [
  new AT({
    "resource": resource,
    "event":"interval",
    "condition":"0 * * * * *",
    "enabled":true,
  }),
  new AT({
    "resource":resource,
    "event":"deferred",
    "condition":"0001-01-01 00:00",
    "enabled":true,
  }),
  new AT({
    "resource": resource,
    "event":"interval",
    "condition":undefined,
    "enabled":true,
  }),
]

describe('components/Admin/Automation/TheDeferredTriggers.vue', () => {
  let propsData = {}

  beforeEach(() => {
    propsData = {
      triggers: [],
      modules: [],
    }
  })

  const mountTDT = (opt) => shallowMount(TheDeferredTriggers, {
    mocks: {},
    propsData,
    ...opt,
  })

  it('prepare scheduled & interval', () => {
    propsData.triggers = stdTriggerList()
    const wrap = mountTDT()

    expect(wrap.findAll(DateTime)).to.have.length(1)
    expect(wrap.findAll(Interval)).to.have.length(2)
  })

  it('create trigger if not exists', () => {
    const wrap = mountTDT()

    wrap.vm.addScheduleTrigger()
    expect(wrap.emitted()['update:triggers'].pop().pop()).to.have.length(1)

    // Should be 1, since parent has to apply the update
    wrap.vm.addIntervalTrigger()
    expect(wrap.emitted()['update:triggers'].pop().pop()).to.have.length(1)
  })

  it('update trigger if exists', () => {
    propsData.triggers = stdTriggerList()
    const wrap = mountTDT()

    wrap.vm.enableByIndex(resource, 'deferred', 'condition.new', 0)
    expect(wrap.emitted()['update:triggers'].pop().pop()).to.have.length(3)

    // Should be 1, since parent has to apply the update
    wrap.vm.enableByIndex(resource, 'interval', 'condition.new', 0)
    expect(wrap.emitted()['update:triggers'].pop().pop()).to.have.length(3)
  })

  it('ignore remove if trigger does not exist', () => {
    propsData.triggers = stdTriggerList()
    const wrap = mountTDT()

    wrap.vm.disableByIndex(resource, 'deferred', 1)
    expect(wrap.emitted()['update:triggers']).to.be.undefined

    // Should be 1, since parent has to apply the update
    wrap.vm.disableByIndex(resource, 'interval', 2)
    expect(wrap.emitted()['update:triggers']).to.be.undefined
  })

  it('remove if trigger exists', () => {
    propsData.triggers = stdTriggerList()
    const wrap = mountTDT()

    wrap.vm.disableByIndex(resource, 'deferred', 0)
    let t = wrap.emitted()['update:triggers'].pop().pop()
    expect(t).to.have.length(3)
    expect(t[1]).to.include({ enabled: false })

    // Should be 1, since parent has to apply the update
    wrap.vm.disableByIndex(resource, 'interval', 0)
    t = wrap.emitted()['update:triggers'].pop().pop()
    expect(t).to.have.length(3)
    expect(t[0]).to.include({ enabled: false })
  })
})
