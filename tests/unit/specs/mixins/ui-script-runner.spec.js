/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'

import uiScriptRunner from 'corteza-webapp-compose/src/mixins/ui-script-runner'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import Module from 'corteza-webapp-compose/src/lib/module'
import UserAgentScript from 'corteza-webapp-common/src/lib/types/shared/automation-ua-script'

chai.use(chaiAsPromised)

describe('mixins/ui-script-runner.js', () => {
  const M = new Module({
    moduleID: 555,
    fields: [
      { name: 'str', type: 'string' },
    ],
  })

  let mixin

  beforeEach(() => {
    mixin = { ...uiScriptRunner.methods }

    // These are in fact computed props,
    // but since we are testing mixin methods,
    // we can just fake them as any other method
    mixin.getMatchingUAScripts = sinon.fake()
    mixin.modules = sinon.fake()
    mixin.$ComposeAPI = {
      recordCreate: sinon.fake(),
      recordUpdate: sinon.fake(),
      recordDelete: sinon.fake(),
    }
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('runScriptsByEvent', () => {
    it('should pass params to ua scripts matcher', async () => {
      mixin.getMatchingUAScripts = sinon.fake.returns()

      await mixin.runScriptsByEvent('EVENT', '42')

      sinon.assert.calledWith(mixin.getMatchingUAScripts, 'EVENT', '42')
    })
  })

  const testCases = [
    { event: 'Create', expectRecord: true },
    { event: 'Update', expectRecord: true },
    { event: 'Delete', expectRecord: false },
  ]

  for (let tc of testCases) {
    describe(tc.event + ' record orchestration', () => {
      it('should use given record as param for delete', async () => {
        const R = new Record(M, { recordID: '66' })

        // fake
        mixin.getMatchingUAScripts = sinon.fake.returns([])

        // fake resolving on delete
        mixin.$ComposeAPI['record' + tc.event] = sinon.fake.resolves(R)

        // Run the chain
        await mixin[tc.event.toLocaleLowerCase() + 'Record']({}, M, new Record(M, R))

        sinon.assert.calledWithMatch(mixin.$ComposeAPI['record' + tc.event], R)
      })

      it('should exec before and after triggers', async () => {
        const R = new Record(M, { recordID: '66' })

        // fake
        mixin.getMatchingUAScripts = sinon.fake.returns([])

        // fake resolving
        mixin.$ComposeAPI['record' + tc.event] = sinon.fake.resolves(R)

        // Run the chain
        await mixin[tc.event.toLocaleLowerCase() + 'Record']({}, M, R)

        sinon.assert.calledTwice(mixin.getMatchingUAScripts)
        expect(mixin.getMatchingUAScripts.getCall(0).args[0]).to.equal('before' + tc.event)
        expect(mixin.getMatchingUAScripts.getCall(0).args[1]).to.equal(M.moduleID)
        expect(mixin.getMatchingUAScripts.getCall(1).args[0]).to.equal('after' + tc.event)
        expect(mixin.getMatchingUAScripts.getCall(1).args[1]).to.equal(M.moduleID)
      })

      it('only script before* event should be able to modify the record that is sent to the API', async () => {
        const R = new Record(M, { recordID: '66', ownedBy: '*', values: { str: '*' } })
        expect(R.ownedBy).is.equal('*')

        mixin.getMatchingUAScripts = (event) => {
          if (event === 'before' + tc.event) {
            // Simple script that modifies record's owner
            return [new UserAgentScript({ source: `$record.ownedBy += 'before*'; $record.values.str += 'before*'` })]
          }

          if (event === 'after' + tc.event) {
            // Simple script that modifies record's owner
            return [new UserAgentScript({ source: `$record.ownedBy += 'after*'; $record.values.str += 'after*'` })]
          }
        }

        expect(R.ownedBy).is.equal('*')
        expect(R.values.str).is.equal('*')

        // Run the chain
        if (tc.expectRecord) {
          // Handling create & update tests, API returns the record
          mixin.$ComposeAPI['record' + tc.event] = sinon.fake(async (record) => Promise.resolve(record))

          let result = await mixin[tc.event.toLocaleLowerCase() + 'Record']({}, M, R)

          expect(result).is.instanceOf(Record)
          expect(result.ownedBy).is.equal('*before*after*')
          expect(result.values.str).is.equal('*before*after*')
        } else {
          // Handling delete test, API does not return the record
          mixin.$ComposeAPI['record' + tc.event] = sinon.fake.resolves(null)

          let result = await mixin[tc.event.toLocaleLowerCase() + 'Record']({}, M, R)

          expect(result).is.equal(null)
        }

        // Record, sent to the API should only have *before* value
        let [argRecord] = mixin.$ComposeAPI['record' + tc.event].args[0]
        expect(argRecord.ownedBy).is.equal('*before*')
        expect(argRecord.values.str).is.equal('*before*')
      })

      it('sync scripts w/ before triggers should prevent record sending to the API', async () => {
        const R = new Record(M, { recordID: '66' })

        mixin.getMatchingUAScripts = (event) => {
          if (event === 'before' + tc.event) {
            // Simple script that modifies record's owner
            return [new UserAgentScript({ source: `return false` })]
          }
        }
        // fake resolving on delete
        mixin.$ComposeAPI['record' + tc.event] = sinon.fake.resolves(R)

        // Run the chain
        expect(mixin[tc.event.toLocaleLowerCase() + 'Record']({}, M, R)).to.be.rejectedWith(Error, 'aborted')

        expect(mixin.$ComposeAPI['record' + tc.event].notCalled).to.be.true
      })

      it('async scripts w/ before triggers should be not prevent execution of main task', async () => {
        const R = new Record(M, { recordID: '66' })

        mixin.getMatchingUAScripts = (event) => {
          if (event === 'before' + tc.event) {
            // Simple script that modifies record's owner
            return [new UserAgentScript({ source: `return false`, async: true })]
          }
        }
        // fake resolving on delete
        mixin.$ComposeAPI['record' + tc.event] = sinon.fake.resolves(R)

        // Run the chain
        await mixin[tc.event.toLocaleLowerCase() + 'Record']({}, M, R)

        sinon.assert.calledOnce(mixin.$ComposeAPI['record' + tc.event])
      })
    })
  }
})
