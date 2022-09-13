<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    module: {
      type: compose.Module,
      required: true,
    },

    field: {
      type: compose.ModuleField,
      required: true,
    },

    connection: {
      type: Object,
      required: true,
    },

    sensitivityLevels: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    f: {
      get () {
        return this.field
      },

      set (f) {
        this.$emit('update:field', f)
      },
    },
  },
}
</script>
