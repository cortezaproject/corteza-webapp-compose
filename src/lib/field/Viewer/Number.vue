<script>
import base from './base'
import numeral from 'numeral'

export default {
  extends: base,

  computed: {
    formatted () {
      const { format, prefix, suffix } = this.field.options

      return prefix + numeral(this.value).format(format) + suffix
    },
  },
}
</script>
