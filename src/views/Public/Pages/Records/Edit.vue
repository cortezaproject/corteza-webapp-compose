<script>
import Grid from '@/components/Public/Page/Grid'
import ViewRecord from './View'
import Record from '@/lib/record'

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
      const payload = {
        moduleID: this.record.moduleID,
        recordID: this.record.recordID,
        fields: this.record.fields,
      }

      this.$crm.moduleRecordEdit(payload).then((rsp) => {
        this.raiseSuccessAlert('Record saved')
        this.$router.push({ name: 'public.page.record' })
      }).catch(this.defaultErrorHandler('Could not update this record'))
    },

    handleBack () {
      this.$router.push({ name: 'public.page.record' })
    },
  },

  components: {
    Grid,
  },
}
</script>
