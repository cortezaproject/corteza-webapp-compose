<script>
import base from './base'

export default {
  extends: base,
  computed: {
    formatted () {
      return this.value ? this.field.options.formatValue(this.value) : null
    },
  },
}
</script>
