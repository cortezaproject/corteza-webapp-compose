import Page from '@/lib/page'

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
        return (ID) => state.set.find(({ pageID }) => ID === pageID)
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
        return CRM.pageList({ moduleID }).then(tt => {
          commit(types.updateSet, tt.map(t => new Page(t)))
          commit(types.completed)
          return getters.set
        })
      },

      async findByID ({ commit, getters }, { pageID, force = false } = {}) {
        if (!force) {
          const oldItem = getters.getByID(pageID)
          if (oldItem) {
            return new Promise((resolve) => resolve(oldItem))
          }
        }

        commit(types.pending)
        return CRM.pageRead({ pageID }).then(raw => {
          let page = new Page(raw)
          commit(types.updateSet, [page])
          commit(types.completed)
          return page
        })
      },

      async create ({ commit }, item) {
        commit(types.pending)
        return CRM.pageCreate(item).then(raw => {
          let page = new Page(raw)
          commit(types.updateSet, [page])
          commit(types.completed)
          return page
        })
      },

      async update ({ commit }, item) {
        commit(types.pending)
        return CRM.pageUpdate(item).then(raw => {
          let page = new Page(raw)
          commit(types.updateSet, [page])
          commit(types.completed)
          return page
        })
      },

      async delete ({ commit }, item) {
        commit(types.pending)
        return CRM.pageDelete(item).then(() => {
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
          const oldIndex = state.set.findIndex(({ pageID }) => pageID === newItem.pageID)
          if (oldIndex > -1) {
            state.set.splice(oldIndex, 1, newItem)
          } else {
            state.set.push(newItem)
          }
        })
      },

      [types.removeFromSet] (state, removedSet) {
        (removedSet || []).forEach(removedItem => {
          const i = state.set.findIndex(({ pageID }) => pageID === removedItem.pageID)
          if (i > -1) {
            state.set.splice(i, 1)
          }
        })
      },
    },
  }
}
