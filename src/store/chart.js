import Chart from '@/lib/chart'

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
        return (ID) => state.set.find(({ chartID }) => ID === chartID)
      },

      set (state) {
        return state.set
      },
    },

    actions: {
      async load ({ commit, getters }, { chartID, force = false } = {}) {
        if (!force && getters.set.length > 1) {
          // When there's forced load, make sure we have more than 1 item in the set
          // in the scenario when user came to detail page first and has one item loaded
          // > 0 would not be sufficient.
          return new Promise((resolve) => resolve(getters.set))
        }

        commit(types.pending)
        return CRM.chartList({ chartID }).then(cc => {
          if (cc && cc.length > 0) {
            commit(types.updateSet, cc.map(c => new Chart(c)))
          }

          commit(types.completed)
          return getters.set
        })
      },

      async findByID ({ commit, getters }, { chartID, force = false } = {}) {
        if (!force) {
          let oldItem = getters.getByID(chartID)
          if (oldItem) {
            return new Promise((resolve) => resolve(oldItem))
          }
        }

        commit(types.pending)
        return CRM.chartRead({ chartID }).then(raw => {
          let chart = new Chart(raw)
          commit(types.updateSet, [chart])
          commit(types.completed)
          return chart
        })
      },

      async create ({ commit }, item) {
        commit(types.pending)
        return CRM.chartCreate(item).then(raw => {
          let chart = new Chart(raw)
          commit(types.updateSet, [chart])
          commit(types.completed)
          return chart
        })
      },

      async update ({ commit }, item) {
        commit(types.pending)
        return CRM.chartUpdate(item).then(raw => {
          let chart = new Chart(raw)
          commit(types.updateSet, [chart])
          commit(types.completed)
          return chart
        })
      },

      async delete ({ commit }, item) {
        commit(types.pending)
        return CRM.chartDelete(item).then(() => {
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
          const i = state.set.findIndex(({ chartID }) => chartID === newItem.chartID)
          if (i > -1) {
            state.set.splice(i, 1, newItem)
          } else {
            state.set.push(newItem)
          }
        })
      },

      [types.removeFromSet] (state, removedSet) {
        (removedSet || []).forEach(removedItem => {
          const i = state.set.findIndex(({ chartID }) => chartID === removedItem.chartID)
          if (i > -1) {
            state.set.splice(i, 1)
          }
        })
      },
    },
  }
}
