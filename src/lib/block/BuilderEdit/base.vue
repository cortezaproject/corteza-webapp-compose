<script>
export default {
  props: {
    namespace: {
      type: Object,
      required: true,
    },

    page: {
      type: Object,
      required: true,
    },

    module: {
      type: Object,
      required: false,
    },

    options: {
      type: Object,
      required: true,
    },
  },

  computed: {
    o: {
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
