<script>
import base from './base'

export default {
  extends: base,

  computed: {
    formatted () {
      return this.field.options.formatValue(this.value)
    },
  },
}
</script>
