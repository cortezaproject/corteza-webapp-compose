<script>
import base from './base'

export default {
  extends: base,

  data () {
    return {
      user: undefined,
    }
  },

  watch: {
    value () {
      this.load()
    },
  },

  mounted () {
    this.load()
  },

  computed: {
    formatted () {
      return this.user ? (this.field.options.formatter(this.user) || this.value) : 'N/A'
    },
  },

  methods: {
    load () {
      console.log(this.value)
      if (this.value && this.value !== (this.user || {}).userID) {
        this.$system.userRead({ userID: this.value }).then(u => {
          this.user = u
        })
      }
    },
  },
}
</script>
