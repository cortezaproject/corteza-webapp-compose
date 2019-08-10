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

      getByScriptID (state) {
        return (scriptID) => state.set.filter(s => s.scriptID === scriptID)
      },
    },

    actions: {
      async load ({ commit, getters }, { namespaceID } = {}) {
        commit(types.pending)
        return ComposeAPI.moduleUaScripts({ namespaceID }).then(({ set }) => {
          if (set && set.length > 0) {
            commit(types.set, set.map(n => new UserAgentScript(n)))
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
