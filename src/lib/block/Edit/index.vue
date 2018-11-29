<template>
  <div>
    <component :is="kind" :options.sync="options"/>
  </div>
</template>

<script>
import * as EditBlocks from './loader'
import optionSyncProp from './mixins/optionSyncProp.js'

export default {
  props: {
    kind: {
      type: String,
      required: true,
    },
  },

  mixins: [
    optionSyncProp,
  ],

  components: {
    ...EditBlocks,
  },
}
</script>
