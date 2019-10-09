export default {
  methods: {
    fetchUsers (fields, records) {
      let userIDs = new Set()
      fields.filter(c => c.kind === 'User').forEach(u => {
        records.forEach(r => {
          const userID = r.values[u.name]
          if (u.isMulti && userID.length > 0) {
            userID.forEach(uID => {
              if (uID && !this.$store.getters['user/findByID'](uID)) {
                userIDs.add(uID)
              }
            })
          } else if (userID && !this.$store.getters['user/findByID'](userID)) {
            userIDs.add(userID)
          }
        })
      })
      this.$store.dispatch('user/fetchUsers', [...userIDs])
    },
  },
}
