<script>
import base from './base'

export default {
  extends: base,

  computed: {
    formatted () {
      const { trueLabel, falseLabel } = this.field.options

      if (this.value) {
        return trueLabel || 'true'
      } else {
        return falseLabel || 'false'
      }
    },
  },
}
</script>
