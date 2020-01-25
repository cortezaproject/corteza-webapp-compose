<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
  props: {
    boundingRect: {
      type: Object,
      required: false,
    },

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

    record: {
      type: compose.Record,
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
