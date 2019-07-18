<script>
import base from './base'
import { mapGetters } from 'vuex'

export default {
  extends: base,

  data () {
    return {
      user: undefined,
    }
  },

  computed: {
    ...mapGetters({
      findByID: 'user/findByID',
    }),

    formatted () {
      if (this.field.isMulti) {
        return this.value.map(v => {
          let user = this.findByID(v)
          return user ? (this.field.options.formatter(user) || v) : this.$t('field.kind.user.na')
        }).join('\n')
      }
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
      if (this.value && this.value !== (this.user || {}).userID && !this.field.isMulti) {
        this.user = this.findByID(this.value)
      }
    },
  },
}
</script>
