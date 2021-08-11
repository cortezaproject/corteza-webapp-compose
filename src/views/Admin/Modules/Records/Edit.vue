<script>
import ViewRecord from './View'

export default {
  i18nOptions: {
    namespaces: 'module',
  },

  name: 'EditRecord',

  extends: ViewRecord,

  data () {
    return {
      inEditing: true,
    }
  },

  computed: {
    title () {
      return this.$t('allRecords.edit.title', { name: this.module.name || '' })
    },
  },

  methods: {
    handleBack () {
      this.$router.push({ name: 'admin.modules.record.view' })
    },
  },
}
</script>
