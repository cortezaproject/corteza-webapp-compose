<script>
import base from './base'

export default {
  extends: base,

  computed: {
    formatted () {
      if (this.field.isMulti && this.value) {
        return this.value.map(v => this.field.options.formatValue(v)).join(this.field.options.multiDelimiter)
      }
      return this.field.options.formatValue(this.value)
    },
  },
}
</script>
