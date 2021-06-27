/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import users from 'corteza-webapp-compose/src/mixins/users'
import sinon from 'sinon'

describe('mixins/users.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('should be able to determine a set of ID\'s to fetch', async () => {
    const fields = [
      { kind: 'String', name: 'f1' },
      { kind: 'User', name: 'f2' },
      { kind: 'User', name: 'createdBy', isSystem: true },
      { kind: 'User', name: 'f4', isMulti: true },
    ]

    const records = [
      { createdBy: '0001', values: { f1: 'invalid', f2: '0002' } },
      { createdBy: '0001', values: { f1: 'invalid' } },
      { createdBy: '0001', values: { f1: 'invalid', f2: '0003', f4: ['0004', '0005', '0002'] } },
      { createdBy: '0001', values: { f1: 'invalid', f2: '0', f4: ['0', undefined] } },
    ]

    const dispatch = sinon.stub()
    const ff = users.methods.fetchUsers.bind({
      $store: {
        getters: { 'user/findByID': () => false },
        dispatch,
      },
    })
    ff(fields, records)

    sinon.assert.calledOnce(dispatch)
    const uIDs = dispatch.args.pop().pop()
    expect(uIDs).to.include.members(['0001', '0002', '0003', '0004', '0005'])
    expect(uIDs).to.not.have.members(['invalid', '0', undefined])
  })
})
