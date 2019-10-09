<script>
import base from './base'
import { mapGetters } from 'vuex'

export default {
  extends: base,

  computed: {
    ...mapGetters({
      findByID: 'user/findByID',
    }),

    formatted () {
      if (this.field.isMulti) {
        return this.value.map(v => {
          return (this.field.options.formatter(this.findByID(v)) || v) || this.$t('field.kind.user.na')
        }).join(this.field.options.multiDelimiter)
      }
      return (this.field.options.formatter(this.findByID(this.value)) || this.value) || this.$t('field.kind.user.na')
    },
  },
}
</script>
