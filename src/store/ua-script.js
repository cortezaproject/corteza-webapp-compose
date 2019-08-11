import UserAgentScript from 'corteza-webapp-common/src/lib/types/shared/automation-ua-script'

const types = {
  pending: 'pending',
  completed: 'completed',
  set: 'set',
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

      getMatching (state) {
        return (event, condition) => state.set.filter(s => s.Match(event, condition))
      },

      getByID (state) {
        return (scriptID) => state.set.find(s => s.scriptID === scriptID)
      },

      manual (state) {
        return state.set.filter(({ events }) => events['manual'] && events['manual'].length > 0)
      },
    },

    actions: {
      async load ({ commit, getters }, { namespaceID } = {}) {
        commit(types.pending)
        return ComposeAPI.moduleUaScripts({ namespaceID }).then(({ set }) => {
          if (set && set.length > 0) {
            // Add to set and freeze the object -- we will not change it. Ever.
            commit(types.set, set.map(n => Object.freeze(new UserAgentScript(n))))
          }

          commit(types.completed)
          return getters.set
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

      [types.set] (state, newSet) {
        state.set.splice(0)
        state.set = newSet
      },
    },
  }
}
