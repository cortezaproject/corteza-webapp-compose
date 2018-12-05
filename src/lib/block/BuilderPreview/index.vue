<template>
  <div class="block" :class="'theme-'+block.theme">
    <div class="block-data">
      <h2>{{ block.title }}</h2>
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
@import "@/assets/sass/components/blocks.scss";

</style>
