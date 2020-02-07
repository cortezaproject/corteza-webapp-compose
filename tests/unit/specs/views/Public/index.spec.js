// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import { createLocalVue } from '@vue/test-utils'
// import Index from 'corteza-webapp-compose/src/views/Public/Index'
// import { compose } from '@cortezaproject/corteza-js'
// import Chart from 'corteza-webapp-compose/src/lib/chart'
// import sinon from 'sinon'
// import Vuex from 'vuex'
//
// const localVue = createLocalVue()
//
// localVue.use(Vuex)
//
// describe('views/Public/Index.vue', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   let propsData, wrap, $router
//   const actions = {
//     module: {
//       create: sinon.stub().returns(new compose.Module())
//     },
//     chart: {
//       create: sinon.stub().returns(new Chart())
//     },
//     page: {
//       create: sinon.stub().returns(new compose.Page())
//     },
//   }
//   let store = new Vuex.Store({
//     modules: {
//       page: {
//         namespaced: true,
//         state: {
//           set: [],
//         },
//         getters: {
//           set: () => {
//             return []
//           },
//           getByID: () => {
//             return () => undefined
//           }
//         }
//       },
//       module: {
//         namespaced: true,
//         state: {
//           set: [],
//         },
//         getters: {
//           set: () => {
//             return []
//           },
//         }
//       },
//       chart: {
//         namespaced: true,
//         state: {
//           set: [],
//         },
//         getters: {
//           set: () => {
//             return []
//           },
//         }
//       }
//     }
//   })
//
//   beforeEach(() => {
//     $router = {
//       push: sinon.stub(),
//     }
//
//     propsData = {
//       namespace: new compose.Namespace({ namespaceID: '000' }),
//       pageID: '',
//     }
//   })
//
//   const mountIndex = (opt) => shallowMount(Index, {
//     mocks: { $router },
//     store,
//     localVue,
//     propsData,
//     ...opt,
//   })
//
//   describe('Onboarding', () => {
//     it('will show steps when needed', () => {
//       const wrapShow = mountIndex()
//
//       expect(wrapShow.vm.showSteps).to.be.true
//       expect(wrapShow.vm.hasModules).to.be.false
//       expect(wrapShow.vm.hasPages).to.be.false
//       expect(wrapShow.vm.hasCharts).to.be.false
//
//       propsData.pageID = '123'
//       const wrapHide = mountIndex()
//
//       expect(wrapHide.vm.showSteps).to.be.false
//       expect(wrapHide.vm.hasModules).to.be.false
//       expect(wrapHide.vm.hasPages).to.be.false
//       expect(wrapHide.vm.hasCharts).to.be.false
//     })
//
//
//     it('will detect step 1', () => {
//       store = new Vuex.Store({
//         modules: {
//           page: {
//             namespaced: true,
//             state: {},
//             getters: {
//               set: () => {
//                 return []
//               },
//               getByID: () => {
//                 return () => undefined
//               }
//             }
//           },
//           module: {
//             namespaced: true,
//             state: {},
//             getters: {
//               set: () => {
//                 return [new compose.Module()]
//               },
//             }
//           },
//           chart: {
//             namespaced: true,
//             state: {},
//             getters: {
//               set: () => {
//                 return []
//               },
//             }
//           }
//         }
//       })
//       wrap = mountIndex()
//
//       expect(wrap.vm.hasModules).to.be.true
//       expect(wrap.vm.hasCharts).to.be.false
//       expect(wrap.vm.hasPages).to.be.false
//     })
//
//     it('will detect step 2', () => {
//       store = new Vuex.Store({
//         modules: {
//           page: {
//             namespaced: true,
//             state: {},
//             getters: {
//               set: () => {
//                 return []
//               },
//               getByID: () => {
//                 return () => undefined
//               }
//             }
//           },
//           module: {
//             namespaced: true,
//             state: {},
//             getters: {
//               set: () => {
//                 return [new compose.Module()]
//               },
//             }
//           },
//           chart: {
//             namespaced: true,
//             state: {},
//             getters: {
//               set: () => {
//                 return [new Chart()]
//               },
//             }
//           }
//         }
//       })
//       wrap = mountIndex()
//
//       expect(wrap.vm.hasModules).to.be.true
//       expect(wrap.vm.hasCharts).to.be.true
//       expect(wrap.vm.hasPages).to.be.false
//     })
//
//
//     it('will detect step 3', () => {
//       store = new Vuex.Store({
//         modules: {
//           page: {
//             namespaced: true,
//             state: {},
//             getters: {
//               set: () => {
//                 return [new compose.Page()]
//               },
//               getByID: () => {
//                 return () => undefined
//               }
//             }
//           },
//           module: {
//             namespaced: true,
//             state: {},
//             getters: {
//               set: () => {
//                 return [new compose.Module()]
//               },
//             }
//           },
//           chart: {
//             namespaced: true,
//             state: {},
//             getters: {
//               set: () => {
//                 return [new Chart()]
//               },
//             }
//           }
//         }
//       })
//       wrap = mountIndex()
//
//       expect(wrap.vm.hasModules).to.be.true
//       expect(wrap.vm.hasCharts).to.be.true
//       expect(wrap.vm.hasPages).to.be.true
//     })
//
//
//     it('will make module', () => {
//
//       store = new Vuex.Store({
//         modules: {
//           page: {
//             namespaced: true,
//             state: {
//               set: [],
//             },
//             getters: {
//               set: () => {
//                 return []
//               },
//               getByID: () => {
//                 return () => undefined
//               }
//             },
//             actions: actions.page,
//           },
//           module: {
//             namespaced: true,
//             state: {
//               set: [],
//             },
//             getters: {
//               set: () => {
//                 return []
//               },
//             },
//             actions: actions.module,
//           },
//           chart: {
//             namespaced: true,
//             state: {
//               set: [],
//             },
//             getters: {
//               set: () => {
//                 return []
//               },
//             },
//             actions: actions.chart,
//           }
//         }
//       })
//
//       wrap = mountIndex()
//
//       wrap.vm.createNewModule()
//       sinon.assert.calledOnce(actions.module.create)
//     })
//
//     it('will make chart', () => {
//       wrap = mountIndex()
//
//       wrap.vm.createNewChart()
//       sinon.assert.calledOnce(actions.chart.create)
//     })
//
//     it('will build page', () => {
//       wrap = mountIndex()
//
//       wrap.vm.createNewPage()
//       sinon.assert.calledOnce(actions.page.create)
//     })
//   })
// })
