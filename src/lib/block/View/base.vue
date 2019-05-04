<script>
export default {
  props: {
    boundingRect: {
      type: Object,
      required: false,
    },

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

    record: {
      type: Object,
      required: false,
    },

    options: {
      type: Object,
      required: true,
    },
  },
}
</script>
