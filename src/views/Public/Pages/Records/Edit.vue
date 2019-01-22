<script>
import Grid from '@/components/Public/Page/Grid'
import triggerRunner from '@/mixins/trigger_runner'
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
      this.updateRecord(this.module, this.record)
        .then((record) => {
          this.$router.push({ name: 'public.page.record' })
        })
        .catch(this.defaultErrorHandler('Could not update this record'))
    },

    handleBack () {
      this.$router.push({ name: 'public.page.record' })
    },
  },

  components: {
    Grid,
  },

  mixins: [
    triggerRunner,
  ],
}
</script>
