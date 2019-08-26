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

  it('properly links passed record reference', () => {
    const namespace = new Namespace({namespaceID: '3003'})
    const refRecModule = new Module({moduleID: '2002'})
    const refRecord = new Record(refRecModule, { recordID: '1000' })

    const store = new Vuex.Store({ modules: { module: {
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

    const cmp = shallowMount(Create, {
      store,
      localVue,
      propsData: {
        namespace,
        refRecord,
        page: new Page({ moduleID: "2001"})
      }
    })

    expect(cmp.vm.record).not.to.be.an('undefined')
    expect(cmp.vm.record.values.ref).not.to.be.an('undefined')
    expect(cmp.vm.record.values.ref).to.equal(refRecord.recordID)
  })
})
