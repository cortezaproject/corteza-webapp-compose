<script>
import { compose } from '@cortezaproject/corteza-js'
import Wrap from './Wrap'

export default {
  components: {
    Wrap,
  },

  props: {
    boundingRect: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    blockIndex: {
      type: Number,
      default: () => -1,
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
      default: () => ({}),
    },

    record: {
      type: compose.Record,
      required: false,
      default: () => ({}),
    },

    mode: {
      type: String,
      required: false,
      default: '',
    },
  },

  computed: {
    options () {
      return this.block.options
    },
  },
}
</script>
