export default {
  data () {
    return {
      sortBy: 'name',
      sortAscending: true,
    }
  },

  methods: {
    sortedItems (items) {
      console.log(this.sortBy)
      let newItems = items.sort((a, b) => {
        if (a[this.sortBy] > b[this.sortBy]) return 1
        if (a[this.sortBy] < b[this.sortBy]) return -1
        return 0
      })

      if (!this.sortAscending) return newItems.reverse()

      return newItems
    },

    handleSort (fieldObject) {
      if (fieldObject.ascending !== undefined) {
        this.sortAscending = fieldObject.ascending
      } else {
        this.sortAscending = true
      }
      this.sortBy = fieldObject.name

      let param = !this.sortAscending ? ('-' + this.sortBy) : this.sortBy
      this.$router.push({ name: this.$route.name, query: { sortBy: param } })
    },

    isSortedBy (fieldName) {
      if (this.$route.query.sortBy) {
        if (!this.$route.query.sortBy.includes(fieldName)) return undefined
        if (this.$route.query.sortBy[0] === '-') {
          if (this.$route.query.sortBy.slice(1) === fieldName) return false
        } else {
          if (this.$route.query.sortBy === fieldName) return true
        }
      }
      return undefined
    },
  },
}
