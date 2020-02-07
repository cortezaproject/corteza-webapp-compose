// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import RecordList from 'corteza-webapp-compose/src/lib/block/View/RecordList'
// import ExporterModal from 'corteza-webapp-compose/src/components/Public/Record/Exporter'
// import ComposeAPI from 'corteza-webapp-common/src/lib/corteza-server/rest-api-client/compose'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import sinon from 'sinon'
// import fp from 'flush-promises'
//
// const records = [
//   {recordID: '100', moduleID: '200', values: [{ name: 'n1', value: 'v1'},{ name: "n2", value: 'v2'}], namespaceID: '300' },
//   {recordID: '101', moduleID: '200', values: [{ name: 'n1', value: 'v1'},{ name: "n2", value: 'v2'}], namespaceID: '301' },
// ]
//
// const rspFilter = () => ({
//   count: 2,
//   page: 1,
//   perPage: 20,
//   sort: '',
//   filter: '',
// })
//
// let mod = new compose.Module({
//   moduleID: '200',
//   fields: [
//     {name: 'n1', kind: 'String'},
//     {name: 'n2', kind: 'String'},
//   ]
// })
//
//
// describe('lib/block/View/RecordList', () => {
//   let propsData, $ComposeAPI, $auth
//   beforeEach(() => {
//     propsData = {
//       options: {},
//       page: {},
//       namespace: {},
//     }
//     $auth = {
//       user: { userID: '888' },
//     }
//     $ComposeAPI = {
//       recordList: sinon.mock().resolves({ set: [], filter: {} })
//     }
//   })
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   const mountRL = (opt) => shallowMount(RecordList, {
//     mocks: { $ComposeAPI, $auth },
//     propsData,
//     ...opt,
//   })
//
//   describe('records', () => {
//     beforeEach(() => {
//       sinon.stub(RecordList, 'created')
//     })
//
//     it('Don\'t render any records if module is not defined', () => {
//       $ComposeAPI.recordList = sinon.mock().resolves({ set: records })
//       const wrap = mountRL()
//
//       expect(wrap.findAll('table tbody tr')).to.have.length(0)
//     })
//
//     it('Render records if module comes in late', () => {
//       // @todo improve this test
//       let local = {
//         recordListModule: mod,
//         recordsRaw: records,
//       }
//
//       expect(RecordList.computed.records.call(local)).to.have.length(2)
//     })
//   })
//
//   describe('record fetching', () => {
//     beforeEach(() => {
//       sinon.stub(RecordList.computed, 'recordListModule').returns(new compose.Module({ moduleID: '333' }))
//       propsData.options.pageID = '111'
//       propsData.options.moduleID = '333'
//     })
//
//     it('on init -- prepare initial filter', () => {
//       sinon.stub(RecordList.methods, 'updateRecordList')
//       const wrap = mountRL()
//
//       expect(wrap.vm.filter).to.not.deep.eq({})
//     })
//
//     it('on init -- evaluate prefilter', () => {
//       sinon.stub(RecordList.methods, 'updateRecordList')
//       propsData.options.prefilter = '${userID} is awesome'
//       const wrap = mountRL()
//
//       expect(wrap.vm.filter.filter).to.include($auth.user.userID)
//     })
//
//     it('fetch records with initial query', async () => {
//       $ComposeAPI.recordList = sinon.mock().resolves({ set: [], filter: rspFilter() })
//       const wrap = mountRL()
//       await fp()
//
//       sinon.assert.calledOnce($ComposeAPI.recordList)
//       expect(wrap.vm.filter).to.deep.eq(rspFilter())
//     })
//
//     it('should be able to refresh current query', async () => {
//       $ComposeAPI.recordList = sinon.stub().resolves({ set: [], filter: rspFilter() })
//       sinon.stub(RecordList, 'created')
//       const wrap = mountRL()
//       wrap.vm.$root.$emit('recordList.refresh')
//       await fp()
//       sinon.assert.calledOnce($ComposeAPI.recordList)
//     })
//   })
//
//   describe('record filtering', () => {
//     beforeEach(() => {
//       sinon.stub(RecordList, 'created')
//       propsData.options.fields = ['n1']
//       propsData.options.pageID = '111'
//       propsData.options.moduleID = '200'
//     })
//
//     describe('textual queries', () => {
//       beforeEach(() => {
//         sinon.stub(RecordList.computed, 'recordListModule').returns(new compose.Module({
//           moduleID: '200',
//           fields: [
//             { name: 'n1', kind: 'String' },
//           ],
//         }))
//       })
//
//       it('regular query', () => {
//         const wrap = mountRL()
//         const query = 'query'
//
//         sinon.stub(wrap.vm, 'updateRecordList')
//         wrap.setData({ query })
//         wrap.vm.handleQuery()
//
//         sinon.assert.calledOnce(wrap.vm.updateRecordList)
//         const cf = wrap.vm.updateRecordList.args.pop().pop().filter
//         expect(cf).to.include(`n1`)
//         expect(cf).to.include(`LIKE`)
//         expect(cf).to.include(`query%`)
//         wrap.vm.updateRecordList.restore()
//       })
//
//       it('wild cards', () => {
//         const wrap = mountRL()
//         const query = 'q*ery**'
//
//         sinon.stub(wrap.vm, 'updateRecordList')
//         wrap.setData({ query })
//         wrap.vm.handleQuery()
//
//         sinon.assert.calledOnce(wrap.vm.updateRecordList)
//         const cf = wrap.vm.updateRecordList.args.pop().pop().filter
//         expect(cf).to.include(`n1`)
//         expect(cf).to.include(`LIKE`)
//         expect(cf).to.include(`q%ery%`)
//         wrap.vm.updateRecordList.restore()
//       })
//     })
//
//     describe('numerical queries', () => {
//       beforeEach(() => {
//         sinon.stub(RecordList.computed, 'recordListModule').returns(new compose.Module({
//           moduleID: '200',
//           fields: [
//             { name: 'n1', kind: 'Number' },
//           ],
//         }))
//       })
//
//       it('regular query', () => {
//         const wrap = mountRL()
//         const query = '123'
//
//         sinon.stub(wrap.vm, 'updateRecordList')
//         wrap.setData({ query })
//         wrap.vm.handleQuery()
//
//         sinon.assert.calledOnce(wrap.vm.updateRecordList)
//         const cf = wrap.vm.updateRecordList.args.pop().pop().filter
//         expect(cf).to.include(`n1`)
//         expect(cf).to.include(`=`)
//         expect(cf).to.include(`123`)
//         wrap.vm.updateRecordList.restore()
//       })
//     })
//
//     describe('boolean queries', () => {
//       beforeEach(() => {
//         sinon.stub(RecordList.computed, 'recordListModule').returns(new compose.Module({
//           moduleID: '200',
//           fields: [
//             { name: 'n1', kind: 'Bool' },
//           ],
//         }))
//       })
//
//       it ('true', () => {
//         const wrap = mountRL()
//         const cases = ['true', '1']
//
//         for (const c of cases) {
//           sinon.stub(wrap.vm, 'updateRecordList')
//           wrap.setData({ query: c })
//           wrap.vm.handleQuery()
//
//           sinon.assert.calledOnce(wrap.vm.updateRecordList)
//           const call = wrap.vm.updateRecordList.args.pop().pop().filter
//           expect(call).to.include('n1')
//           expect(call).to.include('=')
//           expect(call).to.include('true')
//           wrap.vm.updateRecordList.restore()
//         }
//       })
//
//       it ('false', () => {
//         const wrap = mountRL()
//         const cases = ['false', '0']
//
//         for (const c of cases) {
//           sinon.stub(wrap.vm, 'updateRecordList')
//           wrap.setData({ query: c })
//           wrap.vm.handleQuery()
//
//           sinon.assert.calledOnce(wrap.vm.updateRecordList)
//           const call = wrap.vm.updateRecordList.args.pop().pop().filter
//           expect(call).to.include('n1')
//           expect(call).to.include('=')
//           expect(call).to.include('false')
//           expect(call).to.include('OR')
//           expect(call).to.include('n1')
//           expect(call).to.include('IS')
//           expect(call).to.include('NULL')
//           wrap.vm.updateRecordList.restore()
//         }
//       })
//
//       it ('invalid', () => {
//         const wrap = mountRL()
//         const cases = [ '-1', undefined, null ]
//
//         for (const c of cases) {
//           sinon.stub(wrap.vm, 'updateRecordList')
//           wrap.setData({ query: c })
//           wrap.vm.handleQuery()
//
//           sinon.assert.calledOnce(wrap.vm.updateRecordList)
//           const call = wrap.vm.updateRecordList.args.pop().pop()
//           expect(call.filter).to.not.include(`true`)
//           expect(call.filter).to.not.include(`false`)
//           wrap.vm.updateRecordList.restore()
//         }
//       })
//     })
//
//     it('include prefilter', () => {
//       sinon.stub(RecordList.computed, 'recordListModule').returns(mod)
//       propsData.options.prefilter = 'pref'
//       const wrap = mountRL()
//       sinon.stub(wrap.vm, 'updateRecordList')
//       wrap.vm.prepRecordList()
//       wrap.setData({ query: 'q' })
//       wrap.vm.handleQuery()
//
//       sinon.assert.calledOnce(wrap.vm.updateRecordList)
//       const cf = wrap.vm.updateRecordList.args.pop().pop().filter
//       expect(cf).to.include('pref')
//       expect(cf).to.include('AND')
//     })
//   })
//
//   describe('record sorting', () => {
//     beforeEach(() => {
//       propsData.options.fields = ['n1']
//       propsData.options.pageID = '111'
//       propsData.options.moduleID = '200'
//       sinon.stub(RecordList.computed, 'recordListModule').returns(new compose.Module({
//         moduleID: '200',
//         fields: [
//           { name: 'n1', kind: 'String' },
//         ],
//       }))
//     })
//
//     it('Toggle ASC, DESC', () => {
//       const wrap = mountRL()
//       const cases = [
//         // field, sort field, desc
//         [ 'f1', 'f1', false ],
//         [ 'f1', 'f1', true ],
//         [ 'f1', 'f1', false ],
//       ]
//
//       for (const [ field, sort, desc ] of cases) {
//         sinon.stub(wrap.vm, 'updateRecordList')
//         wrap.vm.handleSort(field)
//         sinon.assert.calledOnce(wrap.vm.updateRecordList)
//         const cf = wrap.vm.updateRecordList.args.pop().pop().sort.toLowerCase()
//         expect(cf).to.include(sort)
//         if (desc) {
//           expect(cf).to.include('desc')
//         } else {
//           expect(cf).to.not.include('desc')
//         }
//         wrap.vm.filter.sort = cf
//         wrap.vm.updateRecordList.restore()
//       }
//     })
//
//     it('Reset on new field', () => {
//       const wrap = mountRL()
//       const cases = [
//         // field, sort field
//         [ 'f1', 'f1' ],
//         [ 'f2', 'f2' ],
//       ]
//
//       for (const [ field, sort ] of cases) {
//         sinon.stub(wrap.vm, 'updateRecordList')
//         wrap.vm.handleSort(field)
//         sinon.assert.calledOnce(wrap.vm.updateRecordList)
//         const cf = wrap.vm.updateRecordList.args.pop().pop().sort.toLowerCase()
//         expect(cf).to.include(sort)
//         expect(cf).to.not.include('desc')
//         wrap.vm.filter.sort = cf
//         wrap.vm.updateRecordList.restore()
//       }
//     })
//   })
//
//   describe('record exporting', () => {
//     beforeEach(() => {
//       sinon.stub(RecordList.computed, 'recordListModule').returns(new compose.Module({ moduleID: '333', name: 'testModule', fields: [ {name: 'n1', kind: 'String'}, {name: 'n2', kind: 'String'} ] }))
//       propsData.options.pageID = '111'
//       propsData.options.moduleID = '333'
//       propsData.options.allowExport = true
//       propsData.namespace.slug = 'nss'
//
//       sinon.stub(global.window, 'open').returns()
//       $ComposeAPI.recordExportEndpoint = ComposeAPI.prototype.recordExportEndpoint
//     })
//
//     it('on export -- generate name based on NS & module', () => {
//       const wrap = mountRL()
//
//       wrap.find(ExporterModal).vm.$emit('export', { filterRaw: { rangeType: 'range', date: { start: 'startPR', end: 'endPR' } } })
//       const [ url ] = global.window.open.args.pop()
//       expect(url).to.include('nss')
//       expect(url).to.include('testModule')
//     })
//
//     it('on export -- generate name for a date-range', () => {
//       const wrap = mountRL()
//
//       wrap.find(ExporterModal).vm.$emit('export', { filterRaw: { rangeType: 'range', date: { start: 'startPR', end: 'endPR' } } })
//       const [ url ] = global.window.open.args.pop()
//       expect(url).to.include('startPR')
//       expect(url).to.include('endPR')
//     })
//
//     it('on export -- generate name for all records', () => {
//       const wrap = mountRL()
//
//       wrap.find(ExporterModal).vm.$emit('export', { filterRaw: { rangeType: 'all' } })
//       const [ url ] = global.window.open.args.pop()
//       expect(url).to.include('all')
//     })
//
//     it('on export -- include query string when so requested', () => {
//       propsData.options.fields = ['n1', 'n2']
//       const wrap = mountRL()
//
//       wrap.find(ExporterModal).vm.$emit('export', {
//         filterRaw: {
//           includeQuery: true,
//           query: 'qstring',
//         }
//       })
//
//       const [ url ] = global.window.open.args.pop()
//       expect(url).to.include('n1%20LIKE%20%27qstring%25%27')
//       expect(url).to.include('n2%20LIKE%20%27qstring%25%27')
//     })
//
//     it('on export -- ignore query string when so requested', () => {
//       propsData.options.fields = ['n1', 'n2']
//       const wrap = mountRL()
//
//       wrap.find(ExporterModal).vm.$emit('export', {
//         filterRaw: {
//           includeQuery: false,
//           query: 'qstring',
//         }
//       })
//
//       const [ url ] = global.window.open.args.pop()
//       expect(url).to.not.include('qstring')
//     })
//
//     it('on export -- combine with date filters', () => {
//       propsData.options.fields = ['n1', 'n2']
//       const wrap = mountRL()
//
//       wrap.find(ExporterModal).vm.$emit('export', {
//         filters: 'filter1',
//         filterRaw: {
//           includeQuery: true,
//           query: 'qstring',
//         }
//       })
//
//       const [ url ] = global.window.open.args.pop()
//       expect(url).to.include('(filter1)')
//       expect(url).to.include('%20AND%20(')
//       expect(url).to.include('qstring')
//     })
//
//     it('on export -- combine with pre-filter', () => {
//       propsData.options.fields = ['n1', 'n2']
//       const wrap = mountRL()
//
//       wrap.setData({ prefilter: 'pref1' })
//       wrap.find(ExporterModal).vm.$emit('export', {
//         filters: 'filter1',
//         filterRaw: {
//           includeQuery: true,
//           query: 'qstring',
//         }
//       })
//
//       const [ url ] = global.window.open.args.pop()
//       expect(url).to.include('(filter1)')
//       expect(url).to.include('(pref1)')
//       expect(url).to.include('%20AND%20(')
//       expect(url).to.include('qstring')
//     })
//   })
//
//   it('create reminder', () => {
//     sinon.stub(RecordList, 'created')
//     const wrap = mountRL()
//     sinon.stub(wrap.vm.$root, '$emit')
//     wrap.vm.createReminder({ values: {} })
//
//     sinon.assert.called(wrap.vm.$root.$emit)
//   })
// })
