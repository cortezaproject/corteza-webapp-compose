<script>
import ViewRecord from './View'
import { compose } from '@cortezaproject/corteza-js'

export default {
  i18nOptions: {
    namespaces: 'module',
  },

  name: 'CreateRecord',

  extends: ViewRecord,

  props: {
    // If component was called (via router) with some pre-seed values
    values: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },

  data () {
    return {
      inEditing: true,
    }
  },

  computed: {
    title () {
      return this.$t('allRecords.create.title', { name: this.module.name || '' })
    },
  },

  created () {
    this.record = new compose.Record(this.module, { values: this.values })
  },
}
</script>
