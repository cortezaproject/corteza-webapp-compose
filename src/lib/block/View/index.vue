<template>
  <div class="block">
    <div class="block-data">
      <div class="block-data-title">{{ block.title }}</div>
      <p class="block-data-description" v-if="block.description">{{ block.description }}</p>
      <div class="block-data-content">
        <component :is="block.kind" :options="block.options" :record="record" />
      </div>
    </div>
  </div>
</template>

<script>
import * as ViewBlocks from './loader'

export default {
  props: {
    block: {
      type: Object,
      required: true,
    },

    record: {
      type: Object,
      required: false,
    },
  },

  components: {
    ...ViewBlocks,
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/components/blocks.scss";

</style>
