import User from 'corteza-webapp-compose/src/lib/user'

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
    },

    mutations: {
      [types.pending] (state) {
        state.pending = true
      },

      [types.completed] (state) {
        state.pending = false
      },

      [types.updateSet] (state, set) {
        set = set.map(u => { return new User(u) })
        if (state.set.length === 0) {
          state.set = set
        } else {
          set.forEach(usr => {
            // Replaces given user due to an update
            const n = state.set.findIndex(u => u.userID === usr.userID)

            // Doesn't yet exist -- add it
            if (n < 0) {
              state.set.push(usr)
            } else {
              state.set.splice(n, 1, usr)
            }
          })
        }
      },
    },
  }
}
