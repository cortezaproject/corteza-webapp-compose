import Trigger from 'corteza-webapp-compose/src/lib/trigger'

const types = {
  pending: 'pending',
  completed: 'completed',
  updateSet: 'updateSet',
  removeFromSet: 'removeFromSet',
  clearSet: 'clearSet',
}

export default function (ComposeAPI) {
  return {
    namespaced: true,

    state: {
      pending: false,
      set: [],
    },

    getters: {
      pending: (state) => state.pending,

      getByID (state) {
        return (ID) => state.set.find(({ triggerID }) => ID === triggerID)
      },

      set (state) {
        return state.set
      },
    },

    actions: {
      async load ({ commit, getters }, { namespaceID, moduleID, clear = false, force = false } = {}) {
        if (clear) {
          commit(types.clearSet)
        }

        if (!force && getters.set.length > 1) {
          // When there's forced load, make sure we have more than 1 item in the set
          // in the scenario when user came to detail page first and has one item loaded
          // > 0 would not be sufficient.
          return new Promise((resolve) => resolve(getters.set))
        }

        commit(types.pending)
        return ComposeAPI.triggerList({ namespaceID, moduleID }).then(({ set, filter }) => {
          if (set && set.length > 0) {
            commit(types.updateSet, set.map(t => new Trigger(t)))
          }

          commit(types.completed)
          return getters.set
        })
      },

      async findByID ({ commit, getters }, { namespaceID, triggerID, force = false } = {}) {
        if (!force) {
          const oldItem = getters.getByID(triggerID)
          if (oldItem) {
            return new Promise((resolve) => resolve(oldItem))
          }
        }

        commit(types.pending)
        return ComposeAPI.triggerRead({ namespaceID, triggerID }).then(raw => {
          let trigger = new Trigger(raw)
          commit(types.updateSet, [trigger])
          commit(types.completed)
          return trigger
        })
      },

      async create ({ commit }, item) {
        commit(types.pending)
        return ComposeAPI.triggerCreate(item).then(raw => {
          let trigger = new Trigger(raw)
          commit(types.updateSet, [trigger])
          commit(types.completed)
          return trigger
        })
      },

      async update ({ commit }, item) {
        commit(types.pending)
        return ComposeAPI.triggerUpdate(item).then(raw => {
          let trigger = new Trigger(raw)
          commit(types.updateSet, [trigger])
          commit(types.completed)
          return trigger
        })
      },

      async delete ({ commit }, item) {
        commit(types.pending)
        return ComposeAPI.triggerDelete(item).then(() => {
          commit(types.removeFromSet, [item])
          commit(types.completed)
          return true
        })
      },

      clearSet ({ commit }) {
        commit(types.clearSet)
      },
    },

    mutations: {
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

      [types.removeFromSet] (state, removedSet) {
        (removedSet || []).forEach(removedItem => {
          const i = state.set.findIndex(({ triggerID }) => triggerID === removedItem.triggerID)
          if (i > -1) {
            state.set.splice(i, 1)
          }
        })
      },

      [types.clearSet] (state) {
        state.pending = false
        state.set.splice(0)
      },
    },
  }
}
