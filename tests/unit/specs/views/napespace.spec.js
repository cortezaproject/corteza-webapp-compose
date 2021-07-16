// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import Namespace from 'corteza-webapp-compose/src/views/Namespace'
// import NamespaceSidebar from 'corteza-webapp-compose/src/components/Namespaces/NamespaceSidebar'
// import sinon from 'sinon'
//
// describe('view/Namespace.vue', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   let propsData, $ComposeAPI
//   beforeEach(() => {
//     propsData = { slug: 'test' }
//     $ComposeAPI = {
//       settingsCurrent: sinon.stub().resolves({}),
//     }
//   })
//
//   const mountNamespace = (opt) => shallowMount(Namespace, {
//     mocks: {
//       $auth: { is: () => true, check: () => true },
//       $ComposeAPI,
//     },
//     propsData,
//     ...opt,
//   })
// })
