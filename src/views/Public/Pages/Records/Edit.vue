<script>
import Grid from '@/components/Public/Page/Grid'
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
      const payload = {
        moduleID: this.record.moduleID,
        contentID: this.record.contentID,
        fields: this.record.fields,
      }

      this.$crm.moduleContentEdit(payload).then((rsp) => {
        if (rsp && rsp.success) {
          this.$router.push({ name: 'public.page.record.edit' })
        } else {
          console.error(rsp)
          this.warningAlert = rsp.message
        }
      }).catch(err => {
        console.error(err)
        this.warningAlert = 'Internal error, could not update this record'
      })
    },
  },

  components: {
    Grid,
  },
}
</script>
