/* eslint-disable */
import { expect } from 'chai'
import { TLink } from 'corteza-webapp-common/src/components/Toaster/display'
import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'

describe('components/Toaster/display/Link.vue', () => {
  let propsData
  beforeEach(() => {
    propsData = {}
  })
  const mountTL = (opt) => shallowMount(TLink, {
    propsData,
    ...opt,
  })

  it('use provided link; from href', () => {
    propsData = {
      link: {
        href: 'www.test.tld',
      },
      resource: 'example:*',
    }
    const wrap = mountTL()

    expect(wrap.findAll('a')).to.have.length(1)
  })

  describe('get router-link from resource + meta', () => {
    it('can fail; no resource', () => {
      propsData = {
        link: {},
        resource: undefined,
      }
      const wrap = mountTL()
  
      expect(wrap.findAll('router-link')).to.have.length(0)
    })

    it('can fail; invalid resource', () => {
      propsData = {
        link: {},
        resource: 'unknown:resource:*',
      }
      const wrap = mountTL()
  
      expect(wrap.findAll('router-link')).to.have.length(0)
    })

    it('success', () => {
      propsData = {
        link: {},
        resource: 'compose:record:132',
      }
      const wrap = mountTL()
      expect(wrap.findAll('router-link-stub')).to.have.length(1)
    })
  })

  describe('alg. for determining router-link from resource + meta', () => {
    const resources = [
      { resource: 'compose:record:123', route: 'page.record' },
    ]
    for (const { resource, route } of resources) {
      expect(TLink.computed.routerLink.call({ resource, link: {} })).to.include({ name: route })
    }
  })

  describe('determine link label', () => {
    const ll = TLink.computed.linkLabel

    it('use provided label', () => {
      expect(ll.call({ link: { label: 'label' } })).to.eq('label')
    })

    it('use provided href as fallback', () => {
      expect(ll.call({ link: { href: 'www.example.tld' } })).to.eq('www.example.tld')
    })

    it('use resource to determine generic label', () => {
      expect(ll.call({ link: {}, resource: 'compose:record', fallbackLabel: TLink.methods.fallbackLabel })).to.not.be.undefined
    })
  })
})
