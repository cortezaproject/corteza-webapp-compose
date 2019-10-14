/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
import Edit from 'corteza-webapp-compose/src/views/Admin/Modules/Edit.vue'
import Field from 'corteza-webapp-common/src/lib/types/compose/module-field'
import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'
import Module from 'corteza-webapp-compose/src/lib/module'
import sinon from 'sinon'

describe('views/Admin/Modules/Edit.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let propsData
  beforeEach(() => {
    propsData = {
      namespace: new Namespace({ namespaceID: '999' }) ,
      moduleID: '123',
    }
  })

  const mountEdit = (opt) => shallowMount(Edit, {
    mocks: {},
    propsData,
    ...opt,
  })

  describe('validates module fields', () => {
    beforeEach(() => {
      sinon.stub(Edit, 'created')
    })

    it('invalid if any **new** field is invalid', () => {
      const cases = [
        [ new Field({ name: '', kind: 'String' }), ],
      ]

      const wrap = mountEdit()

      for (const fields of cases) {
        wrap.setData({ module: new Module({ fields }) })
        expect(wrap.vm.fieldsValid).to.be.false
      }
    })

    it('allow old invalid fields -- legacy support', () => {
      const cases = [
        [ new Field({ fieldID: '9748', name: '', kind: 'String' }), ],
      ]

      const wrap = mountEdit()

      for (const fields of cases) {
        wrap.setData({ module: new Module({ fields }) })
        expect(wrap.vm.fieldsValid).to.be.true
      }
    })

    it('allow valid new and old fields', () => {
      const cases = [
        [ new Field({ fieldID: '9748', name: 'f1', kind: 'String' }), ],
        [ new Field({ name: 'f2', kind: 'String' }), ],
      ]

      const wrap = mountEdit()

      for (const fields of cases) {
        wrap.setData({ module: new Module({ fields }) })
        expect(wrap.vm.fieldsValid).to.be.true
      }
    })
  })
})
