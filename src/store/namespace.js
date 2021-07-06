import { compose } from '@cortezaproject/corteza-js'

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
        return (ID) => state.set.find(({ namespaceID }) => ID === namespaceID)
      },

      getByUrlPart (state) {
        return (urlPart) => state.set.find(({ slug, namespaceID }) => (urlPart === slug) || (urlPart === namespaceID))
      },

      set (state) {
        return state.set
      },
    },

    actions: {
      async load ({ commit, getters }, { force = false } = {}) {
        if (!force && getters.set.length > 1) {
          // When there's forced load, make sure we have more than 1 item in the set
          // in the scenario when user came to detail page first and has one item loaded
          // > 0 would not be sufficient.
          return new Promise((resolve) => resolve(getters.set))
        }

        commit(types.pending)
        // @todo expect issues with larger sets of namespaces because we do paging on the API
        return ComposeAPI.namespaceList({}).then(({ set, filter }) => {
          if (set && set.length > 0) {
            commit(types.updateSet, set.map(n => new compose.Namespace(n)))
          }

          commit(types.completed)
          return getters.set
        })
      },

      async findByID ({ commit, getters }, { namespaceID, force = false } = {}) {
        if (!force) {
          const oldItem = getters.getByID(namespaceID)
          if (oldItem) {
            return new Promise((resolve) => resolve(oldItem))
          }
        }

        commit(types.pending)
        return ComposeAPI.namespaceRead({ namespaceID }).then(raw => {
          const namespace = new compose.Namespace(raw)
          commit(types.updateSet, [namespace])
          commit(types.completed)
          return namespace
        })
      },

      async create ({ commit }, item) {
        commit(types.pending)
        return ComposeAPI.namespaceCreate(item).then(raw => {
          const namespace = new compose.Namespace(raw)
          commit(types.updateSet, [namespace])
          commit(types.completed)
          return namespace
        })
      },

      async update ({ commit }, item) {
        commit(types.pending)
        return ComposeAPI.namespaceUpdate(item).then(raw => {
          const namespace = new compose.Namespace(raw)
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
        set = set.map(i => Object.freeze(i))

        if (state.set.length === 0) {
          state.set = set
          return
        }

        set.forEach(newItem => {
          const oldIndex = state.set.findIndex(({ namespaceID }) => namespaceID === newItem.namespaceID)
          if (oldIndex > -1) {
            state.set.splice(oldIndex, 1, newItem)
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

      [types.clearSet] (state) {
        state.pending = false
        state.set.splice(0)
      },
    },
  }
}
