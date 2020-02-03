<template>
  <grid
    v-if="page.blocks"
    :blocks="page.blocks"
    :editable="false"
    :key="page.pageID"
  >
    <template
      slot-scope="{ boundingRect, block, index }"
    >
      <page-block
        v-bind="{ ...$attrs, block, page, boundingRect, blockIndex: index }"
        v-on="$listeners"
      />
    </template>
  </grid>
</template>
<script>
import Grid from '../../Common/Grid'
import PageBlock from '../../PageBlocks'
import { compose } from '@cortezaproject/corteza-js'

export default {
  name: 'public-grid',

  components: {
    Grid,
    PageBlock,
  },

  props: {
    page: {
      type: compose.Page,
      required: true,
    },
  },
}
</script>
