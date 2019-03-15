<script>
import base from './base'

export default {
  extends: base,

  data () {
    return {
      user: undefined,
    }
  },

  computed: {
    formatted () {
      return this.user ? (this.field.options.formatter(this.user) || this.value) : this.$t('field.kind.user.na')
    },
  },

  watch: {
    value () {
      this.load()
    },
  },

  mounted () {
    this.load()
  },

  methods: {
    load () {
      if (this.value && this.value !== (this.user || {}).userID) {
        this.$system.userRead({ userID: this.value }).then(u => {
          this.user = u
        })
      }
    },
  },
}
</script>
