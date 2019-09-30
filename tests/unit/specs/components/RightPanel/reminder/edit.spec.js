/* eslint-disable */
import { expect } from 'chai'
import Edit from 'corteza-webapp-compose/src/components/RightPanel/reminder/Edit'
import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'

describe('components/RightPanel/reminder/Edit.vue', () => {
  let propsData
  beforeEach(() => {
    propsData = { myID: '1', users: [] }
  })
  const mountEdit = (opt) => shallowMount(Edit, {
    propsData,
    ...opt,
  })

  describe('emit save with payload', () => {
    it('Defined time', () => {
      propsData.edit = {
        resource: 'example:*',
        payload: {
          remindAt: 1000,
        },
      }
      const wrap = mountEdit()
      wrap.vm.saveAndClose()

      const evt = wrap.emitted().save.pop().pop()
      expect(evt.remindAt).to.not.be.undefined
    })

    it('Undefined time', () => {
      propsData.edit = {
        resource: 'example:*',
        payload: {},
      }
      const wrap = mountEdit()
      wrap.vm.saveAndClose()

      const evt = wrap.emitted().save.pop().pop()
      expect(evt.remindAt).to.be.undefined
    })
  })

  describe('get assignee list', () => {
    let users = [
      { userID: '1', name: 'name' },
      { userID: '2', name: 'name' },
      { userID: '3', name: 'IsMe' },
    ]
    let meID = '3'

    it('process list for vue-select', () => {
      const test = Edit.computed.assignees.call({ users, meID })
      expect(test).to.have.length(3)
      expect(test[0]).to.have.keys([ 'userID', 'label' ])
    })

    it('Should treat me specially', () => {
      const test = Edit.computed.assignees.call({ users, meID })
      expect(test[2].label).to.not.eq('name')
    })
  })
})
