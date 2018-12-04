export default {
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },

  computed: {
    s: {
      get () {
        return this.settings
      },

      set (s) {
        this.$emit('update:settings', s)
      },
    },
  },
}
