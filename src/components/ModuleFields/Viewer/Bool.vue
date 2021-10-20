<script>
import base from './base'

export default {
  extends: base,

  computed: {
    formatted () {
      const {
        trueLabel = 'true',
        falseLabel = 'false',
      } = this.field.options

      if (this.value === '1') {
        return trueLabel
      } else if (this.value === '0') {
        return falseLabel
      }

      return ''
    },
  },
}
</script>
