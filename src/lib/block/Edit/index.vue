<template>
  <div>
    <component :is="kind" :options.sync="options"/>
  </div>
</template>

<script>
import * as EditBlocks from './loader'
import optionsSyncProp from './mixins/optionsSyncProp.js'

export default {
  props: {
    kind: {
      type: String,
      required: true,
    },
  },

  mixins: [
    optionsSyncProp,
  ],

  components: {
    ...EditBlocks,
  },
}
</script>
