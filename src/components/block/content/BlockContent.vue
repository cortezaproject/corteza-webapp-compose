<template>
  <div class="block-content">
    <BlockContentFields v-if="fields" :fields="fields"></BlockContentFields>
    <BlockContentList v-if="list" :list="list"></BlockContentList>
  </div>
</template>

<script>

import BlockContentFields from '@/components/block/content/BlockContentFields'
import BlockContentList from '@/components/block/content/list/BlockContentList'

export default {
  name: 'BlockContent',
  components: {
    BlockContentFields,
    BlockContentList,
  },
  props: ['content'],
  computed: {
    fields () {
      return this.content && this.content.fields ? this.content.fields : null
    },
    list () {
      return this.content && this.content.list ? this.content.list : null
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
