<script>
import base from './base'

export default {
  extends: base,

  computed: {
    formatted () {
      if (this.field.isMulti && this.value) {
        return this.value.map(v => this.field.options.formatValue(v)).join('\n')
      }
      return this.field.options.formatValue(this.value)
    },
  },
}
</script>
