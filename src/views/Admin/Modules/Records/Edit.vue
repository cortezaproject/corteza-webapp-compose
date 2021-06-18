<script>
import ViewRecord from './View'

export default {
  name: 'EditRecord',

  extends: ViewRecord,

  data () {
    return {
      inEditing: true,
    }
  },

  computed: {
    title () {
      return this.$t('module.allRecords.edit.title', { name: this.module.name || '' })
    },
  },

  methods: {
    handleBack () {
      this.$router.push({ name: 'admin.modules.record.view' })
    },
  },
}
</script>
