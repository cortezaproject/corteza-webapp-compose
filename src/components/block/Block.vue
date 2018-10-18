<template>
  <div class="block">
    <div class="block-data">
      <div class="block-data__title">{{ block.data.title }}</div>
      <p class="block-data__description">{{ block.data.description }}</p>
      <div class="block-data__content">
        <BlockContent :content="block.content"></BlockContent>
      </div>
      <div class="block-data__footer">
        <p>{{ block.data.footer }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import BlockContent from '@/components/block/content/BlockContent'

export default {
  name: 'Block',
  components: {
    BlockContent,
  },
  props: ['block'],
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
