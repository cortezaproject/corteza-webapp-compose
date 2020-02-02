<template>
  <b-tabs active-nav-item-class="bg-grey"
          nav-wrapper-class="bg-white"
          active-tab-class="tab-content h-auto overflow-auto"
          card>

    <b-tab active :title="$t('general.label.general')">
      <basic :block="block" />
    </b-tab>

    <component v-if="blockComponent"
              :is="block.kind"
              v-bind="$props" />
  </b-tabs>
</template>

<script>
import * as EditBlocks from './loader'
import basic from './basic'
import base from './base'

export default {
  components: {
    ...EditBlocks,
    basic,
  },

  extends: base,

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
