import Module from '@/lib/module'

const types = {
  pending: 'pending',
  completed: 'completed',
  updateSet: 'updateSet',
  removeFromSet: 'removeFromSet',
}

export default function (CRM) {
  return {
    namespaced: true,

    state: {
      pending: false,
      set: [],
    },

    getters: {
      pending: (state) => state.pending,

      getByID (state) {
        return (ID) => state.set.find(({ moduleID }) => ID === moduleID)
      },

      set (state) {
        return state.set
      },
    },

    actions: {
      async load ({ commit, getters }, { moduleID, force = false } = {}) {
        if (!force && getters.set.length > 1) {
          // When there's forced load, make sure we have more than 1 item in the set
          // in the scenario when user came to detail page first and has one item loaded
          // > 0 would not be sufficient.
          return new Promise((resolve) => resolve(getters.set))
        }

        commit(types.pending)
        return CRM.moduleList({ moduleID }).then(mm => {
          if (mm && mm.length > 0) {
            commit(types.updateSet, mm.map(m => new Module(m)))
          }

          commit(types.completed)
          return getters.set
        })
      },

      async findByID ({ commit, getters }, { moduleID, force = false } = {}) {
        if (!force) {
          const oldItem = getters.getByID(moduleID)
          if (oldItem) {
            return new Promise((resolve) => resolve(oldItem))
          }
        }

        commit(types.pending)
        return CRM.moduleRead({ moduleID }).then(raw => {
          let module = new Module(raw)
          commit(types.updateSet, [module])
          commit(types.completed)
          return module
        })
      },

      async create ({ commit }, item) {
        commit(types.pending)
        return CRM.moduleCreate(item).then(raw => {
          let module = new Module(raw)
          commit(types.updateSet, [module])
          commit(types.completed)
          return module
        })
      },

      async update ({ commit }, item) {
        commit(types.pending)
        return CRM.moduleUpdate(item).then(raw => {
          let module = new Module(raw)
          commit(types.updateSet, [module])
          commit(types.completed)
          return module
        })
      },

      async delete ({ commit }, item) {
        commit(types.pending)
        return CRM.moduleDelete(item).then(() => {
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

      [types.updateSet] (state, set) {
        set.forEach(newItem => {
          const i = state.set.findIndex(({ moduleID }) => moduleID === newItem.moduleID)
          if (i > -1) {
            state.set.splice(i, 1, newItem)
          } else {
            state.set.push(newItem)
          }
        })
      },

      [types.removeFromSet] (state, removedSet) {
        (removedSet || []).forEach(removedItem => {
          const i = state.set.findIndex(({ moduleID }) => moduleID === removedItem.moduleID)
          if (i > -1) {
            state.set.splice(i, 1)
          }
        })
      },
    },
  }
}
