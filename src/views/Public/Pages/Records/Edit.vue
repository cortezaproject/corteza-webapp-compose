<script>
import Grid from 'corteza-webapp-compose/src/components/Public/Page/Grid'
import triggerRunner from 'corteza-webapp-compose/src/mixins/ui-script-runner'
import ViewRecord from './View'

export default {
  name: 'EditRecord',

  components: {
    Grid,
  },

  extends: ViewRecord,

  mixins: [
    triggerRunner,
  ],

  data () {
    return {
      editMode: true,
    }
  },

  methods: {
    handleUpdate () {
      this.updateRecord(this.namespace, this.module, this.record)
        .then((record) => {
          this.$router.push({ name: 'page.record', params: { ...this.$route.params } })
        })
        .catch(this.defaultErrorHandler(this.$t('notification.record.updateFailed')))
    },

    handleBack () {
      this.$router.push({ name: 'page.record' })
    },
  },
}
</script>
