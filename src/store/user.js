import _ from 'lodash'
import User from 'corteza-webapp-compose/src/lib/user'

const types = {
  pending: 'pending',
  completed: 'completed',
  addID: 'addID',
  removeID: 'removeID',
  updateSet: 'updateSet',
}

export default function (SystemAPI) {
  return {
    namespaced: true,

    state: {
      pending: false,
      set: [],
      userIDs: new Set(),
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
      async load ({ commit }) {
        commit(types.pending)
        SystemAPI.userList().then(({ set }) => {
          commit(types.updateSet, set)
          commit(types.completed)
        })
      },

      findUserByID ({ commit, getters }, userID) {
        const user = getters.findByID(userID)
        if (!user) {
          commit(types.pending)
          commit(types.addID, userID)
          commit(types.completed)
          this.dispatch('user/fetchUsers')
        }
      },

      fetchUsers: _.debounce(({ commit, state }) => {
        [...state.userIDs].map(userID => {
          commit(types.pending)
          SystemAPI.userRead({ userID }).then(user => {
            commit(types.removeID, userID)
            commit(types.updateSet, [user])
            commit(types.completed)
          })
        }, 200)
      }),
    },

    mutations: {
      [types.pending] (state) {
        state.pending = true
      },

      [types.completed] (state) {
        state.pending = false
      },

      [types.addID] (state, userID) {
        state.userIDs.add(userID)
      },

      [types.removeID] (state, userID) {
        state.userIDs.delete(userID)
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
