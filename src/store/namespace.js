import Namespace from '@/lib/namespace'

const types = {
  pending: 'pending',
  completed: 'completed',
  updateSet: 'updateSet',
  removeFromSet: 'removeFromSet',
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
        return (ID) => state.set.find(({ namespaceID }) => ID === namespaceID)
      },

      set (state) {
        return state.set
      },
    },

    actions: {
      async load ({ commit, getters }, { namespaceID, force = false } = {}) {
        if (!force && getters.set.length > 1) {
          // When there's forced load, make sure we have more than 1 item in the set
          // in the scenario when user came to detail page first and has one item loaded
          // > 0 would not be sufficient.
          return new Promise((resolve) => resolve(getters.set))
        }

        commit(types.pending)
        return ComposeAPI.namespaceList({ namespaceID }).then(cc => {
          if (cc && cc.length > 0) {
            commit(types.updateSet, cc.map(c => new Namespace(c)))
          }

          commit(types.completed)
          return getters.set
        })
      },

      async findByID ({ commit, getters }, { namespaceID, force = false } = {}) {
        if (!force) {
          let oldItem = getters.getByID(namespaceID)
          if (oldItem) {
            return new Promise((resolve) => resolve(oldItem))
          }
        }

        commit(types.pending)
        return ComposeAPI.namespaceRead({ namespaceID }).then(raw => {
          let namespace = new Namespace(raw)
          commit(types.updateSet, [namespace])
          commit(types.completed)
          return namespace
        })
      },

      async create ({ commit }, item) {
        commit(types.pending)
        return ComposeAPI.namespaceCreate(item).then(raw => {
          let namespace = new Namespace(raw)
          commit(types.updateSet, [namespace])
          commit(types.completed)
          return namespace
        })
      },

      async update ({ commit }, item) {
        commit(types.pending)
        return ComposeAPI.namespaceUpdate(item).then(raw => {
          let namespace = new Namespace(raw)
          commit(types.updateSet, [namespace])
          commit(types.completed)
          return namespace
        })
      },

      async delete ({ commit }, item) {
        commit(types.pending)
        return ComposeAPI.namespaceDelete(item).then(() => {
          commit(types.removeFromSet, [item])
          commit(types.completed)
          return true
        })
      },
    },

    mutations: {
      [types.pending] (state) {
        state.pending = true
      },

      [types.completed] (state) {
        state.pending = false
      },

      [types.updateSet] (state, updatedSet) {
        (updatedSet || []).forEach(newItem => {
          const i = state.set.findIndex(({ namespaceID }) => namespaceID === newItem.namespaceID)
          if (i > -1) {
            state.set.splice(i, 1, newItem)
          } else {
            state.set.push(newItem)
          }
        })
      },

      [types.removeFromSet] (state, removedSet) {
        (removedSet || []).forEach(removedItem => {
          const i = state.set.findIndex(({ namespaceID }) => namespaceID === removedItem.namespaceID)
          if (i > -1) {
            state.set.splice(i, 1)
          }
        })
      },
    },
  }
}
