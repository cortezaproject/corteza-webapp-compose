<script>
export default {
  props: {
    field: {
      type: Object,
      required: true,
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
