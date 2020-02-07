// /* eslint-disable */
// import { expect } from 'chai'
// import DateTime from 'corteza-webapp-compose/src/lib/field/Editor/DateTime'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import { compose } from '@cortezaproject/corteza-js'
// import Field from 'corteza-webapp-compose/src/lib/field'
// import moment from 'moment'
//
// describe('lib/field/Editor/DateTime.vue', () => {
//   let propsData
//   beforeEach(() => {
//     propsData = {
//       namespace: {
//         namespaceID: '0001'
//       },
//       field: {
//         kind: 'DateTime',
//         name: 'uu',
//         validate: () => {},
//         options: {},
//       },
//       record: {
//         recordID: '1000',
//         values: {
//           uu: ''
//         },
//         compareToValues: {},
//       },
//       valueOnly: true,
//     }
//   })
//   const mountDT = (opt) => shallowMount(DateTime, {
//     propsData,
//     ...opt,
//   })
//
//   describe('single field - input value validation', () => {
//     let field, module, record
//     beforeEach(() => {
//       field = new Field({
//         "name": "future",
//         "label": "future",
//         "kind": "DateTime",
//         "options": {
//           "format": "",
//           "onlyDate": false,
//           "onlyTime": false,
//           "onlyPastValues": false,
//           "onlyFutureValues": false,
//           "outputRelative": false,
//           "multiDelimiter": "\n"
//         },
//       })
//
//       module = {
//         "moduleID": "mod.0001",
//         "namespaceID": "ns.0001",
//         "name": "test",
//         "handle": "test",
//         "fields": [field],
//       }
//
//       record = new compose.Record(module, { values: { future: moment().toISOString() } })
//     })
//
//     it('no validation specified', () => {
//       propsData.field = field
//       propsData.record = record
//
//       const wrap = mountDT()
//       expect(wrap.find('div.test-error').exists()).to.be.false
//     })
//
//     it('future only values', () => {
//       field.options.onlyFutureValues = true
//       propsData.field = field
//       propsData.record = record
//       propsData.record = new compose.Record(module, { values: { future: moment().add(-1, 'day').toISOString() } })
//       propsData.record.compareToValues = {}
//
//       const wrap = mountDT()
//       const err = wrap.find('div.test-error')
//       expect(err.exists()).to.be.true
//       expect(err.text()).to.eq('notification.field-datetime.valueNotFuture')
//     })
//
//     it('past only values', () => {
//       field.options.onlyPastValues = true
//       propsData.field = field
//       propsData.record = record
//       propsData.record = new compose.Record(module, { values: { future: moment().add(1, 'day').toISOString() } })
//       propsData.record.compareToValues = {}
//
//       const wrap = mountDT()
//       const err = wrap.find('div.test-error')
//       expect(err.exists()).to.be.true
//       expect(err.text()).to.eq('notification.field-datetime.valueNotPast')
//     })
//
//     it('ignore validation if value not changed', () => {
//       field.options.onlyPastValues = true
//       propsData.field = field
//       propsData.record = record
//       propsData.record = new compose.Record(module, { values: { future: moment().add(1, 'day').toISOString() } })
//
//       const wrap = mountDT()
//       const err = wrap.find('div.test-error')
//       expect(err.exists()).to.be.false
//     })
//   })
//
//   describe('multi field - input value validation', () => {
//     let field, module, record
//     beforeEach(() => {
//       field = new Field({
//         "name": "future",
//         "label": "future",
//         "kind": "DateTime",
//         isMulti: true,
//         "options": {
//           "format": "",
//           "onlyDate": false,
//           "onlyTime": false,
//           "onlyPastValues": false,
//           "onlyFutureValues": false,
//           "outputRelative": false,
//           "multiDelimiter": "\n"
//         },
//       })
//
//       module = {
//         "moduleID": "mod.0001",
//         "namespaceID": "ns.0001",
//         "name": "test",
//         "handle": "test",
//         "fields": [field],
//       }
//
//       record = new compose.Record(module, { values: { future: [moment() .toISOString() ] } })
//     })
//     it('no validation specified', () => {
//       propsData.field = field
//       propsData.record = record
//
//       const wrap = mountDT()
//       expect(wrap.find('div.test-error').exists()).to.be.false
//     })
//
//     it('future only values', () => {
//       field.options.onlyFutureValues = true
//       propsData.field = field
//       propsData.record = record
//       propsData.record = new compose.Record(module, { values: { future: [ moment().add(-1, 'day').toISOString() ] } })
//       propsData.record.compareToValues = {}
//
//       const wrap = mountDT()
//       const err = wrap.find('div.test-error')
//       expect(err.exists()).to.be.true
//       expect(err.text()).to.eq('notification.field-datetime.valueNotFuture')
//     })
//
//     it('past only values', () => {
//       field.options.onlyPastValues = true
//       propsData.field = field
//       propsData.record = record
//       propsData.record = new compose.Record(module, { values: { future: [ moment().add(1, 'day').toISOString() ] } })
//       propsData.record.compareToValues = {}
//
//       const wrap = mountDT()
//       const err = wrap.find('div.test-error')
//       expect(err.exists()).to.be.true
//       expect(err.text()).to.eq('notification.field-datetime.valueNotPast')
//     })
//
//     it('ignore validation if value not changed', () => {
//       field.options.onlyPastValues = true
//       propsData.field = field
//       propsData.record = record
//       propsData.record = new compose.Record(module, { values: { future: [ moment().add(1, 'day').toISOString() ] } })
//
//       const wrap = mountDT()
//       const err = wrap.find('div.test-error')
//       expect(err.exists()).to.be.false
//     })
//   })
// })
