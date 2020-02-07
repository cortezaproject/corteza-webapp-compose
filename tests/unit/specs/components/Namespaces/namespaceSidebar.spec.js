// /* eslint-disable */
// import { expect } from 'chai'
// import NamespaceSidebar from 'corteza-webapp-compose/src/components/Namespaces/NamespaceSidebar'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
//
// describe('components/Namespaces/NamespaceSidebar.vue', () => {
//   let propsData
//   beforeEach(() => {
//     propsData = {
//       namespaces: [],
//     }
//   })
//
//   const mountNS = (opt) => shallowMount(NamespaceSidebar, {
//     propsData,
//     ...opt,
//   })
//
//   it('handle filtering', () => {
//     const tests = [
//       {
//         name: 'no query, no filter',
//         namespaces: [
//           { namespaceID: '0003', name: 'bGroup1' },
//           { namespaceID: '0001', name: 'aGroup1' },
//           { namespaceID: '0002', name: 'aGroup2' },
//         ],
//         filter: null,
//         expect: function ({ pinned, regular }) {
//           expect(regular, this.name).to.have.length(3)
//           expect(regular[0], this.name).to.include({ namespaceID: '0001' })
//           expect(regular[1], this.name).to.include({ namespaceID: '0002' })
//           expect(regular[2], this.name).to.include({ namespaceID: '0003' })
//         },
//       },
//       {
//         name: 'query with valid results',
//         namespaces: [
//           { namespaceID: '0003', name: 'bGroup1' },
//           { namespaceID: '0001', name: 'aGroup1' },
//           { namespaceID: '0002', name: 'aGroup2' },
//         ],
//         filter: 'a',
//         expect: function ({ pinned, regular }) {
//           expect(regular, this.name).to.have.length(2)
//           expect(regular[0], this.name).to.include({ namespaceID: '0001' })
//           expect(regular[1], this.name).to.include({ namespaceID: '0002' })
//         },
//       },
//       {
//         name: 'query with no results',
//         namespaces: [
//           { namespaceID: '0003', name: 'bGroup1' },
//           { namespaceID: '0001', name: 'aGroup1' },
//           { namespaceID: '0002', name: 'aGroup2' },
//         ],
//         filter: 'c',
//         expect: function ({ pinned, regular }) {
//           expect(regular, this.name).to.have.length(0)
//         },
//       },
//     ]
//
//     for (const t of tests) {
//       propsData.namespaces = t.namespaces
//       const wrap = mountNS()
//       wrap.setData({ filter: t.filter })
//       t.expect(wrap.vm.filteredNamespaces)
//     }
//   })
// })
