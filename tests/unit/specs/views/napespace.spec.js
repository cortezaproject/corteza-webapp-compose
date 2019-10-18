/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
import Namespace from 'corteza-webapp-compose/src/views/Namespace'
import NamespaceSidebar from 'corteza-webapp-compose/src/components/Namespaces/NamespaceSidebar'
import sinon from 'sinon'

describe('view/Namespace.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  let propsData
  beforeEach(() => {
    propsData = { slug: 'test' }
  })

  const mountNamespace = (opt) => shallowMount(Namespace, {
    mocks: { $auth: { is: () => true, check: () => true } },
    propsData,
    ...opt,
  })

  it('Properly filters namespaces for ns switcher', () => {
    sinon.stub(Namespace, 'watch').get(() => ({}))
    sinon.stub(Namespace, 'mounted')
    sinon.stub(Namespace.methods, 'namespaceLoader').resolves({ set: [] })

    const wrap = mountNamespace()
    wrap.setData({
      showNSSideBar: true,
      namespaces: [
        { namespaceID: '111', enabled: true },
        { namespaceID: '112', enabled: false },
        { namespaceID: '113', enabled: true },
        { namespaceID: '114', enabled: false },
      ]
    })

    const nss = wrap.find(NamespaceSidebar)
    expect(nss.exists()).to.be.true
    expect(nss.props().namespaces).to.have.length(2)
    for (const { enabled } of nss.props().namespaces) {
      expect(enabled).to.be.true
    }
  })
})
