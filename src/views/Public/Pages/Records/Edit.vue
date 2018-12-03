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
      console.log(this.record)
      alert('Pending implementation')
    },
  },

  components: {
    Grid,
  },
}
</script>
