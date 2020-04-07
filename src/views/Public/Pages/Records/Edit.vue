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

  methods: {
    handleBack () {
      this.$router.push({ name: 'page.record' })
    },
  },
}
</script>
