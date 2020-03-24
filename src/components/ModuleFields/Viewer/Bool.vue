<script>
import base from './base'

export default {
  extends: base,

  computed: {
    formatted () {
      const { trueLabel, falseLabel } = this.field.options

      if ([1, '1', 'true', true].includes(this.value)) {
        return trueLabel || 'true'
      } else {
        return falseLabel || 'false'
      }
    },
  },
}
</script>
