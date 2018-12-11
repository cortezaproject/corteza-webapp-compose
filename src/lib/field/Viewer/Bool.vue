<script>
import base from './base'

export default {
  extends: base,

  computed: {
    formatted () {
      const { trueLabel, falseLabel } = this.field.options

      return this.value ? (trueLabel || 'true') : (falseLabel || 'false')
    },
  },
}
</script>
