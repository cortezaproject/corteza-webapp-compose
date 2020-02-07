// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { createLocalVue } from '@vue/test-utils'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import Edit from 'corteza-webapp-compose/src/views/Admin/Modules/Edit.vue'
// import { compose } from '@cortezaproject/corteza-js'
// import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
// import Vuex from 'vuex'
// import sinon from 'sinon'
// import fp from 'flush-promises'
//
// const localVue = createLocalVue()
// localVue.use(Vuex)
//
// describe('views/Admin/Modules/Edit.vue', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   const store = new Vuex.Store({ modules: { page: {
//     namespaced: true,
//     state: {},
//     getters: {
//       set: () => {
//         return []
//       }
//     }
//   }}})
//
//   let propsData, $router
//   beforeEach(() => {
//     $router = {
//       push: sinon.stub(),
//     }
//     propsData = {
//       namespace: new compose.Namespace({ namespaceID: '999' }) ,
//       moduleID: '123',
//     }
//   })
//
//   const mountEdit = (opt) => shallowMount(Edit, {
//     store,
//     localVue,
//     mocks: { $router },
//     propsData,
//     ...opt,
//   })
//
//   describe('validates module fields', () => {
//     beforeEach(() => {
//       sinon.stub(Edit, 'created')
//     })
//
//     it('invalid if any **new** field is invalid', () => {
//       const cases = [
//         [ new Field({ name: '', kind: 'String' }), ],
//       ]
//
//       const wrap = mountEdit()
//
//       for (const fields of cases) {
//         wrap.setData({ module: new compose.Module({ fields }) })
//         expect(wrap.vm.fieldsValid).to.be.false
//       }
//     })
//
//     it('allow old invalid fields -- legacy support', () => {
//       const cases = [
//         [ new Field({ fieldID: '9748', name: '', kind: 'String' }), ],
//       ]
//
//       const wrap = mountEdit()
//
//       for (const fields of cases) {
//         wrap.setData({ module: new compose.Module({ fields }) })
//         expect(wrap.vm.fieldsValid).to.be.true
//       }
//     })
//
//     it('allow valid new and old fields', () => {
//       const cases = [
//         [ new Field({ fieldID: '9748', name: 'f1', kind: 'String' }), ],
//         [ new Field({ name: 'f2', kind: 'String' }), ],
//       ]
//
//       const wrap = mountEdit()
//
//       for (const fields of cases) {
//         wrap.setData({ module: new compose.Module({ fields }) })
//         expect(wrap.vm.fieldsValid).to.be.true
//       }
//     })
//   })
//
//   describe('on save', () => {
//     it('set processing flag during processing', async () => {
//       sinon.stub(Edit, 'created').returns(() => {})
//       sinon.stub(Edit.methods, 'updateModule').resolves(({ moduleID: '000' }))
//       const wrap = mountEdit()
//
//       const tb = wrap.find(EditorToolbar)
//       tb.vm.$emit('save')
//       expect(tb.props().disableSave).to.be.true
//     })
//   })
//
//   describe('onboarding', () => {
//     describe('record page creation', () => {
//       it('creates record page', async () => {
//         sinon.stub(Edit, 'created').returns(() => {})
//         sinon.stub(Edit.methods, 'createPage').resolves({})
//         sinon.stub(Edit.computed, 'recordListPage').returns({ pageID: '0001' })
//         const wrap = mountEdit()
//         wrap.vm.handleRecordPageCreation()
//
//         await fp()
//         sinon.assert.calledOnce(Edit.methods.createPage)
//         const args = Edit.methods.createPage.args.pop().pop()
//         expect(args).to.include({ namespaceID: '999', selfID: '0001' })
//       })
//     })
//
//     describe('record list creation', () => {
//       it('creates record list', async () => {
//         sinon.stub(Edit, 'created').returns(() => {})
//         sinon.stub(Edit.methods, 'createPage').resolves({ pageID: '0001', blocks: [] })
//         sinon.stub(Edit.methods, 'updatePage').resolves({})
//         const wrap = mountEdit()
//         wrap.setData({ recordList: {} })
//         wrap.vm.handleRecordListCreation()
//
//         await fp()
//         sinon.assert.calledOnce(Edit.methods.updatePage)
//         const args = Edit.methods.updatePage.args.pop().pop()
//         expect(args.blocks).to.have.length(1)
//         expect(args.blocks[0].kind).to.eq('RecordList')
//       })
//     })
//
//     describe('navigation to recordList', () => {
//       it('navigate to view', () => {
//         sinon.stub(Edit, 'created').returns(() => {})
//         sinon.stub(Edit.computed, 'recordListPage').returns({ pageID: '0001' })
//         const wrap = mountEdit()
//
//         wrap.vm.toRecordList('view')
//         sinon.assert.calledOnce($router.push)
//         sinon.assert.calledWith($router.push, { name: 'page', params: { pageID: '0001' } })
//       })
//
//       it('navigate to edit', () => {
//         sinon.stub(Edit, 'created').returns(() => {})
//         sinon.stub(Edit.computed, 'recordListPage').returns({ pageID: '0001' })
//         const wrap = mountEdit()
//
//         wrap.vm.toRecordList('edit')
//         sinon.assert.calledOnce($router.push)
//         sinon.assert.calledWith($router.push, { name: 'admin.pages.builder', params: { pageID: '0001' } })
//       })
//
//       it('ignore invalid views', () => {
//         sinon.stub(Edit, 'created').returns(() => {})
//         sinon.stub(Edit.computed, 'recordListPage').returns({ pageID: '0001' })
//         const wrap = mountEdit()
//
//         wrap.vm.toRecordList()
//         sinon.assert.notCalled($router.push)
//       })
//     })
//   })
// })
