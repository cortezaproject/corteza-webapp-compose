<script>
import base from './base'
import { formatNumberFull } from '@/lib/field/Number'

export default {
  extends: base,

  computed: {
    formatted () {
      const { format, prefix, suffix, precision } = this.field.options

      return formatNumberFull(format, prefix, suffix, precision, this.value)
    },
  },
}
</script>
