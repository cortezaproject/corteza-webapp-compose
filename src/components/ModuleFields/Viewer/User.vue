<script>
import base from './base'
import { mapGetters } from 'vuex'
import { NoID } from '@cortezaproject/corteza-js'

export default {
  extends: base,

  computed: {
    ...mapGetters({
      findByID: 'user/findByID',
    }),

    formatted () {
      const f = (u) => {
        if (u === NoID) {
          return
        }

        if (typeof u === 'string') {
          u = this.findByID(u)
        }

        if (!u) {
          return
        }

        return this.field.formatter(u)
      }

      if (this.field.isMulti) {
        return this.value.map(v => f(v) || this.$t('field.kind.user.na')).join(this.field.options.multiDelimiter)
      }

      return f(this.value) || this.$t('field.kind.user.na')
    },
  },
}
</script>
