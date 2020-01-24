<script>
export default {
  props: {
    options: {
      type: Object,
      required: true,
    },

    namespace: {
      type: Object,
      required: true,
    },

    module: {
      type: Object,
      required: false,
    },
  },
}
</script>
