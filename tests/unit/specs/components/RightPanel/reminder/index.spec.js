// /* eslint-disable */
// import { expect } from 'chai'
// import Vuex from 'vuex'
// import { createLocalVue } from '@vue/test-utils'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import Reminder from 'corteza-webapp-compose/src/components/RightPanel/reminder'
// import sinon from 'sinon'
// import fp from 'flush-promises'
//
// const localVue = createLocalVue()
// localVue.use(Vuex)
//
// describe('src/components/RightPanel/reminder', () => {
//   afterEach(() => {
//     sinon.restore()
//   })
//
//   let propsData, $SystemAPI, $auth, store
//   beforeEach(() => {
//     propsData = { namespaceID: '10000' }
//     $SystemAPI = {
//       reminderCreate: sinon.stub().resolves({}),
//       reminderUpdate: sinon.stub().resolves({}),
//     }
//
//     $auth = {
//       user: {
//         userID: '0001'
//       },
//     }
//
//     store = new Vuex.Store({ modules: {
//       user: {
//         namespaced: true,
//         state: {},
//         getters: {
//           set: () => [],
//         },
//       },
//     }})
//   })
//   const mountReminder = (opt) => shallowMount(Reminder, {
//     propsData,
//     localVue,
//     store,
//     mocks: { $SystemAPI, $auth },
//     ...opt,
//   })
//
//   describe('on save', () => {
//     it('on save & assigned to me, add to reminder list', async () => {
//       $SystemAPI.reminderUpdate = sinon.stub().resolves({ assignedTo: '0001' })
//       sinon.stub(Reminder.methods, 'fetchReminders').resolves([])
//       const wrap = mountReminder()
//       wrap.vm.onSave({ reminderID: '2000' })
//       await fp()
//
//       sinon.assert.calledOnce($SystemAPI.reminderUpdate)
//       expect(wrap.vm.reminders).to.have.length(1)
//     })
//
//     it('on save & not assigned to me, ignore it', async () => {
//       $SystemAPI.reminderUpdate = sinon.stub().resolves({ assignedTo: '0002' })
//       sinon.stub(Reminder.methods, 'fetchReminders').resolves([])
//       const wrap = mountReminder()
//       wrap.vm.onSave({ reminderID: '2000' })
//       await fp()
//
//       sinon.assert.calledOnce($SystemAPI.reminderUpdate)
//       expect(wrap.vm.reminders).to.have.length(0)
//     })
//   })
// })
