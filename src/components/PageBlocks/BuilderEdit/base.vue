<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    page: {
      type: compose.Page,
      required: true,
    },

    block: {
      type: compose.PageBlock,
      required: true,
    },

    module: {
      type: compose.Module,
      required: false,
    },
  },

  computed: {
    options: {
      get () {
        return this.options
      },

      set (o) {
        this.$emit('update:options', o)
      },
    },
  },
}
</script>
