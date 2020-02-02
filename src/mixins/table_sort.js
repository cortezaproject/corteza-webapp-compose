export default {
  data () {
    return {
      sortBy: 'name',
      sortAscending: true,
    }
  },

  methods: {
    sortedItems (items) {
      const newItems = items.sort((a, b) => {
        return (String(a[this.sortBy]) || '').localeCompare(String(b[this.sortBy]) || '')
      })

      if (!this.sortAscending) {
        return newItems.reverse()
      }

      return newItems
    },

    handleSort ({ ascending, name }) {
      if (ascending !== undefined) {
        this.sortAscending = ascending
      } else {
        this.sortAscending = true
      }
      this.sortBy = name

      const param = !this.sortAscending ? ('-' + this.sortBy) : this.sortBy
      this.$router.push({ name: this.$route.name, query: { sortBy: param } })
    },

    isSortedBy (fieldName, def = undefined) {
      const sortBy = this.$route.query.sortBy

      if (sortBy) {
        if (!sortBy.includes(fieldName)) {
          return undefined
        }
        if (sortBy[0] === '-') {
          if (sortBy.slice(1) === fieldName) return false
        } else {
          if (sortBy === fieldName) return true
        }
      }
      return def
    },
  },
}
