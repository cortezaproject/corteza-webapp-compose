export default {
  methods: {
    fetchUsers (fields = [], records = []) {
      const userIDs = new Set()
      fields
        .filter(c => c.kind === 'User')
        .forEach(u => {
          records.forEach(r => {
            if (r) {
              let userID
              if (u.isSystem) {
                userID = r[u.name]
              } else {
                userID = r.values[u.name]
              }

              if (u.isMulti && userID) {
                userID.forEach(uID => {
                  if (uID && uID !== '0' && !this.$store.getters['user/findByID'](uID)) {
                    userIDs.add(uID)
                  }
                })
              } else if (userID && userID !== '0' && !this.$store.getters['user/findByID'](userID)) {
                userIDs.add(userID)
              }
            }
          })
        })

      if (userIDs.size > 0) {
        this.$store.dispatch('user/fetchUsers', [...userIDs])
      }
    },
  },
}
