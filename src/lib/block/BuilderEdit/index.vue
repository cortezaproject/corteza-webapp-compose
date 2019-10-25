<template>
  <b-tabs active-nav-item-class="bg-grey"
          nav-wrapper-class="bg-white"
          active-tab-class="tab-content h-auto overflow-auto"
          card>

    <b-tab active :title="$t('general.label.general')">
      <basic :block="block" />
    </b-tab>
    <b-tab v-if="blockComponent" :title="block.kind">
      <component :is="block.kind"
                 :namespace="namespace"
                 :module="module"
                 :page="page"
                 :options.sync="block.options"/>
    </b-tab>
  </b-tabs>
</template>

<script>
import * as EditBlocks from './loader'
import basic from './basic'

export default {
  components: {
    ...EditBlocks,
    basic,
  },

  props: {
    block: {
      type: Object,
      required: true,
    },

    namespace: {
      type: Object,
      required: true,
    },

    page: {
      type: Object,
      required: true,
    },

    module: {
      type: Object,
      required: false,
    },
  },

  computed: {
    blockComponent () {
      // If block doesn't have a configurator, we show no block tab
      return EditBlocks[this.block.kind]
    },
  },
}
</script>
<style lang="scss" scoped>
.tab-content {
  max-height: 70vh;
}
</style>
