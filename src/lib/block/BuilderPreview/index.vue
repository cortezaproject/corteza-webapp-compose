<template>
  <b-card class="h-100 border-0"
          :class="blockClass"
          :header="block.title"
          :sub-title="block.description"
          header-class="sticky-top h5"
          :header-bg-variant="block.style.variants.headerBg"
          :header-text-variant="block.style.variants.headerText"
          :header-border-variant="block.style.variants.border"
          :body-bg-variant="block.style.variants.bodyBg">
    <b-card-text>
      <component :is="block.kind"
                 :options="block.options"
                 :module="module"
                 :namespace="namespace"/>
    </b-card-text>
  </b-card>
</template>

<script>
import * as PreviewBlocks from './loader'

export default {
  components: {
    ...PreviewBlocks,
  },

  props: {
    namespace: {
      type: Object,
      required: true,
    },

    block: {
      type: Object,
      required: true,
    },

    module: {
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
