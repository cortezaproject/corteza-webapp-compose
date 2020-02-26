import { system } from '@cortezaproject/corteza-js'

const types = {
  pending: 'pending',
  completed: 'completed',
  updateSet: 'updateSet',
}

export default function (SystemAPI) {
  return {
    namespaced: true,

    state: {
      pending: false,
      set: [],
    },

    getters: {
      pending: (state) => state.pending,

      findByID (state) {
        return (ID) => state.set.find(({ userID }) => ID === userID)
      },

      findByUsername: (state) => (username) => {
        return state.set.filter(user => user.username === username)[0] || undefined
      },

      set (state) {
        return state.set
      },
    },

    actions: {
      async load ({ commit, getters }) {
        commit(types.pending)
        SystemAPI.userList().then(({ set }) => {
          commit(types.updateSet, set)
          commit(types.completed)
        })
      },

      async fetchUsers ({ commit }, userID) {
        commit(types.pending)
        SystemAPI.userList({ userID }).then(({ set }) => {
          commit(types.updateSet, set)
          commit(types.completed)
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

      [types.updateSet] (state, set) {
        set = set.map(i => Object.freeze(new system.User(i)))

        if (state.set.length === 0) {
          state.set = set
          return
        }

        set.forEach(newItem => {
          const oldIndex = state.set.findIndex(({ pageID }) => pageID === newItem.pageID)
          if (oldIndex > -1) {
            state.set.splice(oldIndex, 1, newItem)
          } else {
            state.set.push(newItem)
          }
        })
      },
    },
  }
}
