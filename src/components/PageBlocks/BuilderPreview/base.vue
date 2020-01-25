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
    options () {
      return this.block.options
    },
  },
}
</script>
