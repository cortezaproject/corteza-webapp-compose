<template>
  <div class="block">
    <div class="block-data">
      <div class="block-data-title">{{ block.title }}</div>
      <p class="block-data-description" v-if="block.description">{{ block.description }}</p>
      <div class="block-data-content">
        <component :is="block.kind" :options="block.options" />
      </div>
    </div>
  </div>
</template>

<script>
import * as PreviewBlocks from './loader'

export default {
  props: {
    block: {
      type: Object,
      required: true,
    },
  },

  components: {
    ...PreviewBlocks,
  },
}
</script>
<style lang="scss" scoped>
.block-data {
  .block-data-title {
    font-size: 15px;
  }

  .block-data-description {
    font-size: 10px;
    border-bottom: 1px solid black;
  }

  .block-data-content {
    fieldset {
      border: none;
    }
  }

  .block-data-footer {
    font-size: 10px;
    position: absolute;
    bottom: 0;
  }
}
</style>
