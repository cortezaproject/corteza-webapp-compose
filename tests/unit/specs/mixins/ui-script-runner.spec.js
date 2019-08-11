/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'

import triggerRunner from 'corteza-webapp-compose/src/mixins/ui-script-runner'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import Module from 'corteza-webapp-compose/src/lib/module'
import UserAgentScript from 'corteza-webapp-common/src/lib/types/shared/automation-ua-script'

chai.use(chaiAsPromised)

describe('mixins/ui-script-runner.js', () => {
  const M = new Module({ moduleID: 555 })

  let mixin

  beforeEach(() => {
    mixin = { ...triggerRunner.methods }

    // These are in fact computed props,
    // but since we are testing mixin methods,
    // we can just fake them as any other method
    mixin.getMatchingUAScripts = sinon.fake()
    mixin.modules = sinon.fake()
    mixin.pages = sinon.fake()
    mixin.$ComposeAPI = {
      recordCreate: sinon.fake(),
      recordUpdate: sinon.fake(),
      recordDelete: sinon.fake(),
    }
  })

  const exec = async (source, ctx) => mixin.run(new UserAgentScript({ source }), ctx)

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

  describe('results caster', () => {
    it('should return false when rval is false', () => {
      expect(mixin.castResult(false)).to.be.false
    })

    it('should return promise when result is a promise', () => {
      expect(mixin.castResult(new Promise(() => 'resolved :)'))).to.be.instanceof(Promise)
    })

    it('should cast to Record', () => {
      expect(mixin.castResult(new Record(M))).to.be.instanceof(Record)
    })

    it('should cast to Module', () => {
      expect(mixin.castResult(M)).to.be.instanceof(Module)
    })

    it('should return $record from context when not false', () => {
      const R = new Record(M)
      expect(mixin.castResult(true, { $record: R })).to.equal(R)
    })
  })

  describe('simple script runner operations', () => {
    // we need to keep UA & corredor scripts as compatible as possible
    // keep in sync with Corredor executor test!

    const ctx = { $record: new Record(new Module()) }

    it('void/undefined return', async () => {
      expect(await exec('return')).is.undefined
    })

    it('falsy return', async () => {
      expect(await exec('return false')).is.false
    })

    it('true w/o context', async () => {
      expect(await exec('return true')).is.undefined
    })

    it('void w/ context', async () => {
      expect(await exec('', ctx)).is.instanceof(Record)
    })

    it('true w/ context', async () => {
      expect(await exec('return true', ctx)).is.instanceof(Record)
    })

    it('rejection with returned promise', () => {
      expect(exec(`return new Promise((resolve,reject) => { reject('niet')})`)).to.be.rejectedWith('niet')
    })

    it.skip('rejection w/o returned promise', () => {
      // @todo skip for now, raises UnhandledPromiseRejectionWarning:
      expect(exec(`new Promise((resolve,reject) => { reject('niet')})`)).to.be.rejectedWith('niet')
    })

    it('throw', () => {
      expect(exec(`throw Error('simple')`)).to.be.rejectedWith(Error, 'simple')
    })
  })

  describe('access to helper functions', () => {
    it('should call recordRead when FindRecordByID is used (explicit module)', async () => {
      mixin.$ComposeAPI.recordRead = sinon.fake.resolves(new Record(M, { recordID: '555' }))

      let result = await exec(`return FindRecordByID('123', new Module({ moduleID: '321', namespaceID: '99' }))`)

      sinon.assert.calledWith(mixin.$ComposeAPI.recordRead, {
        recordID: '123',
        moduleID: '321',
        namespaceID: '99',
      })

      expect(result).instanceOf(Record)
    })

    it('should call recordRead when FindRecordByID is used (using $module)', async () => {
      mixin.$ComposeAPI.recordRead = sinon.fake.resolves(new Record(M, { recordID: '555' }))

      let result = await exec(`return FindRecordByID('123')`, {
        $module: new Module({ moduleID: '321', namespaceID: '99' }),
      })

      sinon.assert.calledWith(mixin.$ComposeAPI.recordRead, {
        recordID: '123',
        moduleID: '321',
        namespaceID: '99',
      })

      expect(result).instanceOf(Record)
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
        await mixin[tc.event.toLocaleLowerCase() + 'Record']({}, M, R)

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

      it('script before* event should be able to modify the record ' + tc.event.toLocaleLowerCase(), async () => {
        const R = new Record(M, { recordID: '66', ownedBy: '*' })
        expect(R.ownedBy).is.equal('*')

        mixin.getMatchingUAScripts = (event) => {
          if (event === 'before' + tc.event) {
            // Simple script that modifies record's owner
            return [new UserAgentScript({ source: `$record.ownedBy += 'before*'` })]
          }

          if (event === 'after' + tc.event) {
            // Simple script that modifies record's owner
            return [new UserAgentScript({ source: `$record.ownedBy += 'after*'` })]
          }
        }

        expect(R.ownedBy).is.equal('*')

        // Run the chain
        if (tc.expectRecord) {
          mixin.$ComposeAPI['record' + tc.event] = sinon.fake(async (record) => Promise.resolve(record))
          let result = await mixin[tc.event.toLocaleLowerCase() + 'Record']({}, M, R)
          expect(result).is.instanceOf(Record)
          expect(result.ownedBy).is.equal('*before*after*')
        } else {
          mixin.$ComposeAPI['record' + tc.event] = sinon.fake.resolves(null)
          expect(await mixin[tc.event.toLocaleLowerCase() + 'Record']({}, M, R)).is.null
        }

        // Record, sent to the API should only have *before* value
        let [argRecord] = mixin.$ComposeAPI['record' + tc.event].args[0]
        expect(argRecord.ownedBy).is.equal('*before*')

        // Original value should be kept intact
        expect(R.ownedBy).is.equal('*')
      })
    })
  }
})
