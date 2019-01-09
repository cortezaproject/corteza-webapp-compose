<script>
import { mapGetters } from 'vuex'
import Grid from '@/components/Public/Page/Grid'
import runner from '@/lib/trigger_runner'
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

  computed: {
    ...mapGetters({
      triggers: 'trigger/set',
    }),
  },

  methods: {
    handleUpdate () {
      const runnerCtx = {
        module: this.page.module,
        record: this.record,
      }

      if (runner(this.triggers, 'beforeUpdate', runnerCtx)) {
        this.$crm.moduleRecordEdit(this.record).then((r) => {
          this.record = new Record(this.page.module, r)
          this.raiseSuccessAlert('Record saved')
          this.$router.push({ name: 'public.page.record' })

          runner(this.triggers, 'afterUpdate', runnerCtx)
        }).catch(this.defaultErrorHandler('Could not update this record'))
      }
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
