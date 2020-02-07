// /* eslint-disable */
// import { expect } from 'chai'
// import FieldPicker from 'corteza-webapp-compose/src/components/Common/Module/FieldPicker'
//
// describe('components/Common/Module/FieldPicker.vue', () => {
//   describe('define all available fields', () => {
//     let module
//     let disabledTypes
//     let systemFields
//     const fields = [
//       {
//         fieldID: "1",
//         kind: "String",
//         label: "f1",
//         name: "f1",
//       },
//       {
//         fieldID: "2",
//         kind: "Email",
//         label: "f2",
//         name: "f2",
//       },
//       {
//         fieldID: "3",
//         kind: "Number",
//         label: "f3",
//         name: "f3",
//       },
//     ]
//     beforeEach(() => {
//       module = new compose.Module({ fields })
//       disabledTypes = []
//     })
//
//     it('no filtering', () => {
//       const sysFieldCount = module.systemFields().length
//       const r = FieldPicker.computed.allFields
//         .call({ module, disabledTypes, systemFields })
//       expect(r).to.have.length(fields.length + sysFieldCount)
//     })
//
//     it('filter module fields', () => {
//       const sysFieldCount = module.systemFields().length
//       const r = FieldPicker.computed.allFields
//         .call({ module, disabledTypes: ['Number'], systemFields })
//       expect(r).to.have.length(fields.length - 1 + sysFieldCount)
//     })
//
//     it('filter system fields', () => {
//       const r = FieldPicker.computed.allFields
//         .call({ module, disabledTypes, systemFields: [ 'ownedBy' ] })
//       expect(r).to.have.length(fields.length + 1)
//     })
//   })
//
//   describe('define available (not picked) fields', () => {
//     let allFields, fields
//     beforeEach(() => {
//       allFields = []
//       fields = []
//     })
//
//     it('no filtering', () => {
//       allFields = [
//         { name: 'f1' },
//         { name: 'f2' },
//         { name: 'f3' },
//       ]
//       const r = FieldPicker.computed.availableFields
//         .call({ allFields, fields })
//       expect(r).to.have.length(3)
//     })
//
//     it('filtering', () => {
//       allFields = [
//         { name: 'f1' },
//         { name: 'f2' },
//         { name: 'f3' },
//       ]
//       fields = [
//         { name: 'f1' },
//         { name: 'f3' },
//       ]
//       const r = FieldPicker.computed.availableFields
//         .call({ allFields, fields })
//       expect(r).to.have.length(1)
//     })
//   })
// })
