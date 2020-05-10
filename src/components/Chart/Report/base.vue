<script>
export default {
  props: {
    report: {
      type: [Object, undefined],
      required: false,
    },

    modules: {
      type: Array,
      required: true,
    },

    supportedMetrics: {
      type: Number,
      required: false,
      default: -1,
    },

    // Specifies what field kinds are supported as a dimension field
    dimensionFieldKind: {
      type: Array,
      required: false,
      default: () => ['Date', 'Select', 'Number', 'Bool'],
    },
  },

  computed: {
    editReport: {
      get () {
        return this.report
      },
      set (v) {
        this.$emit('update:report', v)
      },
    },
  },
}
</script>
