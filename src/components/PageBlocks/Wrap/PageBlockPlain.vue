<template>
  <div class="overflow-hidden">
    <slot name="toolbar" />
    <slot name="body" />
    <slot name="footer" />
  </div>
</template>
<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
  props: {
    block: {
      type: compose.PageBlock,
      required: true,
    },

    boundingRect: {
      type: Object,
      required: false,
    },
  },

  computed: {
    blockClass () {
      return [
        'block',
        this.block.kind,
      ]
    },
  },
}
</script>
