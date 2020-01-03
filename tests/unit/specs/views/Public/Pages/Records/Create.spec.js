/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Create from 'corteza-webapp-compose/src/views/Public/Pages/Records/Create'
import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'
import Module from 'corteza-webapp-compose/src/lib/module'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import Page from 'corteza-webapp-compose/src/lib/page'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Create', () => {
  let propsData, namespace, refRecModule, refRecord, store

  namespace = new Namespace({namespaceID: '3003'})
  refRecModule = new Module({moduleID: '2002', fields: [ { name: 'dummy' } ]})
  refRecord = new Record(refRecModule, { recordID: '1000' })

  beforeEach(() => {
    store = new Vuex.Store({ modules: { module: {
      namespaced: true,
      state: {},
      getters: {
        getByID: () => (moduleID) => {
          return new Module({
            moduleID: '2001',
            fields: [
              {name: 'ref', kind: 'Record', options: {moduleID: refRecModule.moduleID}},
            ],
          })
        }
      }
    }}})

    propsData = {
      namespace,
      refRecord,
      page: new Page({ moduleID: "2001"})
    }
  })

  const mountCreate = (opt) => shallowMount(Create, {
    store,
    localVue,
    propsData,
    ...opt,
  })

  it('properly links passed record reference', () => {
    const cmp = mountCreate()

    expect(cmp.vm.record).not.to.be.an('undefined')
    expect(cmp.vm.record.values.ref).not.to.be.an('undefined')
    expect(cmp.vm.record.values.ref).to.equal(refRecord.recordID)
  })

  it('properly prefills record values', () => {
    propsData.values = { Name:'Test' }
    const cmp = mountCreate()

    expect(cmp.vm.record.values).to.have.property('Name').that.deep.equals('Test')
  })
})
