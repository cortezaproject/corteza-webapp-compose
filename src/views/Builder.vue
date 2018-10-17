<template>
  <div class="builder" v-if="loaded">

    <BlockSelector></BlockSelector>
    <DoneButton></DoneButton>
    <BuilderGrid></BuilderGrid>

  </div>
</template>

<script>
import BlockSelector from '@/components/builder/BlockSelector'
import BuilderGrid from '@/components/builder/BuilderGrid'
import DoneButton from '@/components/builder/DoneButton'

export default {
  components: {
    BlockSelector,
    DoneButton,
    BuilderGrid,
  },
  data () {
    return {
      loaded: true,
      modules: [],
      result: {},
    }
  },

  created () {
    this.fetchPage()
  },

  methods: {
    async fetchPage () {
      await this.$store.dispatch('builder/fetchPageData', this.$route.query.pageId)
    },
  },
}
</script>
<style lang="scss" scoped>
.builder {
  display: flex;
}
</style>
