<script>
import ViewRecord from './View'

export default {
  name: 'EditRecord',

  extends: ViewRecord,

  data () {
    return {
      editMode: true,
    }
  },

  methods: {
    handleUpdate () {
      this
        .handleFormSubmit(() => this.$ComposeAPI.recordUpdate(this.record))
        .catch(this.defaultErrorHandler(this.$t('notification.record.updateFailed')))
    },

    handleBack () {
      this.$router.push({ name: 'page.record' })
    },
  },
}
</script>
