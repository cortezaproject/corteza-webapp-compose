export default {
  props: {
    options: {
      type: Object,
      required: false,
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
