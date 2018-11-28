<template>
  <div class="block" v-if="block">
    <div class="block-data">
      <div class="block-data__title">{{ block.title }}</div>
      <p class="block-data__description">{{ block.description }}</p>
      <div class="block-data__content">
        <BlockContent :content="block.options"></BlockContent>
      </div>
      <div class="block-data__footer">
        <p>{{ block.footer }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import BlockContent from '@/components/block/content/BlockContent'

export default {
  name: 'BlockComp',
  components: {
    BlockContent,
  },
  props: {
    block: null,
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
