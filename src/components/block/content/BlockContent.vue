<template>
  <div class="block-content">
    <BlockContentFields v-if="fields" :fields="fields"></BlockContentFields>
  </div>
</template>

<script>
import BlockContentFields from '@/components/block/content/BlockContentFields'

export default {
  name: 'BlockContent',
  components: {
    BlockContentFields,
  },
  props: ['content'],
  computed: {
    fields () {
      return this.content && this.content.fields ? this.content.fields : null
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
