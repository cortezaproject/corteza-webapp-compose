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
      this.updateRecord(this.page.module, this.record)
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
