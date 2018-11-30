<template>
  <div class="block">
    <div class="block-data">
      <div class="block-data__title">{{ block.title }}</div>
      <p class="block-data__description" v-if="block.description">{{ block.description }}</p>
      <div class="block-data__content">
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
.block-data {
  .block-data__title {
    font-size: 15px;
  }

  .block-data__description {
    font-size: 10px;
    border-bottom: 1px solid black;
  }

  .block-data__content {
    fieldset {
      border: none;
    }
  }

  .block-data__footer {
    font-size: 10px;
    position: absolute;
    bottom: 0;
  }
}
</style>
