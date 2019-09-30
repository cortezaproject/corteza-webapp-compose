/* eslint-disable */
import { expect, assert } from 'chai'
import List from 'corteza-webapp-compose/src/components/RightPanel/reminder/List'
import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
import Reminder from 'corteza-webapp-common/src/lib/types/shared/reminder'

describe('components/RightPanel/reminder/List.vue', () => {
  let propsData
  beforeEach(() => {
    propsData = { myID: '1', users: [] }
  })
  const mountList = (opt) => shallowMount(List, {
    propsData,
    ...opt,
  })

  const reminders = () => [
    new Reminder({ reminderID: '1', remindAt: '2000-01-01T01:03:00+02:00' }),
    new Reminder({ reminderID: '2', remindAt: '2000-01-01T01:00:00+02:00', dismissedAt: '2000-01-01T01:00:00+02:00' }),
    new Reminder({ reminderID: '3', remindAt: '2000-01-01T01:02:00+02:00' }),
    new Reminder({ reminderID: '2', remindAt: '2000-01-01T01:01:00+02:00', dismissedAt: '2000-01-01T01:00:00+02:00' }),
    new Reminder({ reminderID: '4', dismissedAt: '2000-01-01T01:00:00+02:00' }),
    new Reminder({ reminderID: '5' }),
  ]

  describe('determine active reminders', () => {
    const fnc = List.computed.remindersActive

    it('filter out dismissed reminders', () => {
      expect(fnc.call({ reminders: reminders(), ...List.methods })).to.have.length(3)
    })

    it('prioritize the ones without remindAt', () => {
      let test = fnc.call({ reminders: reminders(), ...List.methods })
      for (let i = 0; i < test.length - 1; i++) {
        if (test[i].remindAt && !test[i + 1].remindAt) {
          assert(false)
        }
      }
    })

    it('sort by remindAt', () => {
      let test = fnc.call({ reminders: reminders(), ...List.methods })
      for (let i = 0; i < test.length - 1; i++) {
        if (test[i].remindAt && test[i].remindAtTime.isAfter(test[i + 1].remindAtTime)) {
          assert(false)
        }
      }
    })
  })

  describe('determine inactive reminders', () => {
    const fnc = List.computed.remindersDismissed

    it('filter out NOT dismissed reminders', () => {
      expect(fnc.call({ reminders: reminders(), ...List.methods })).to.have.length(3)
    })

    it('prioritize the ones without remindAt', () => {
      let test = fnc.call({ reminders: reminders(), ...List.methods })
      for (let i = 0; i < test.length - 1; i++) {
        if (test[i].remindAt && !test[i + 1].remindAt) {
          assert(false)
        }
      }
    })

    it('sort by remindAt', () => {
      let test = fnc.call({ reminders: reminders(), ...List.methods })
      for (let i = 0; i < test.length - 1; i++) {
        if (test[i].remindAt && test[i].remindAtTime.isAfter(test[i + 1].remindAtTime)) {
          assert(false)
        }
      }
    })
  })
})
