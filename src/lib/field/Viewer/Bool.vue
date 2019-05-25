<script>
import base from './base'

export default {
  extends: base,

  computed: {
    formatted () {
      const { trueLabel, falseLabel } = this.field.options
      if (!this.value || this.value === 'false') {
        return falseLabel || 'false'
      } else {
        return trueLabel || 'true'
      }
    },
  },
}
</script>
