import CRM from '@/api/crm'
import Trigger from '@/lib/trigger'

const types = {
  pending: 'pending',
  completed: 'completed',
  updateSet: 'updateSet',
  removeFromSet: 'removeFromSet',
}

// Initial state
const state = {
  pending: false,
  set: [],
}

// getters
const getters = {
  pending: (state) => state.pending,

  getByID (state) {
    return (ID) => state.set.find(({ triggerID }) => ID === triggerID)
  },

  set (state) {
    return state.set
  },
}

// actions
const actions = {
  async load ({ commit, getters }, { moduleID, force = false } = {}) {
    if (!force && getters.set.length > 1) {
      // When there's forced load, make sure we have more than 1 item in the set
      // in the scenario when user came to detail page first and has one item loaded
      // > 0 would not be sufficient.
      return new Promise((resolve) => resolve(getters.set))
    }

    commit(types.pending)
    return CRM.triggerList({ moduleID }).then(tt => {
      commit(types.updateSet, tt.map(t => new Trigger(t)))
      commit(types.completed)
      return getters.set
    })
  },

  async findByID ({ commit, getters }, { triggerID, force = false } = {}) {
    if (!force) {
      const oldItem = getters.getByID(triggerID)
      if (oldItem) {
        return new Promise((resolve) => resolve(oldItem))
      }
    }

    commit(types.pending)
    return CRM.triggerRead({ triggerID }).then(raw => {
      let trigger = new Trigger(raw)
      commit(types.updateSet, [trigger])
      commit(types.completed)
      return trigger
    })
  },

  async create ({ commit }, item) {
    commit(types.pending)
    return CRM.triggerCreate(item).then(raw => {
      let trigger = new Trigger(raw)
      commit(types.updateSet, [trigger])
      commit(types.completed)
      return trigger
    })
  },

  async update ({ commit }, item) {
    commit(types.pending)
    return CRM.triggerUpdate(item).then(raw => {
      let trigger = new Trigger(raw)
      commit(types.updateSet, [trigger])
      commit(types.completed)
      return trigger
    })
  },

  async delete ({ commit }, item) {
    commit(types.pending)
    return CRM.triggerDelete(item).then(() => {
      commit(types.removeFromSet, [item])
      commit(types.completed)
      return true
    })
  },
}

// mutations
const mutations = {
  [types.pending] (state) {
    state.pending = true
  },

  [types.completed] (state) {
    state.pending = false
  },

  [types.updateSet] (state, set) {
    set.forEach(newItem => {
      const oldIndex = state.set.findIndex(({ triggerID }) => triggerID === newItem.triggerID)
      if (oldIndex > -1) {
        state.set.splice(oldIndex, 1, newItem)
      } else {
        state.set.push(newItem)
      }
    })
  },

  [types.removeFromSet] (state, oldItem) {
    const oldIndex = state.set.findIndex(({ triggerID }) => triggerID === oldItem.triggerID)
    if (oldIndex > -1) {
      state.set.splice(oldIndex, 1)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
