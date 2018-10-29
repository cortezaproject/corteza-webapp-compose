<template>
  <div class="block-content">
    <BlockContentFields v-if="fields" :fields="fields"></BlockContentFields>
    <BlockContentList v-if="list" :list="list"></BlockContentList>
    <BlockContentListBuilder v-if="listBuilder" :list="listBuilder"></BlockContentListBuilder>
  </div>
</template>

<script>

import BlockContentFields from '@/components/block/content/BlockContentFields'
import BlockContentList from '@/components/block/content/list/BlockContentList'
import BlockContentListBuilder from '@/components/block/content/list/BlockContentListBuilder'

export default {
  name: 'BlockContent',
  components: {
    BlockContentFields,
    BlockContentList,
    BlockContentListBuilder,
  },
  props: ['content'],
  computed: {
    fields () {
      return (this.content && this.content.fields && this.content.fields.length > 0) ? this.content.fields : null
    },
    list () {
      return (this.content && this.content.list && this.content.list.fields && this.content.list.fields.length > 0) ? this.content.list : null
    },
    listBuilder () {
      return (this.content && this.content.listBuilder && this.content.listBuilder.fields && this.content.listBuilder.fields.length > 0) ? this.content.listBuilder : null
    },
  },
}
</script>
