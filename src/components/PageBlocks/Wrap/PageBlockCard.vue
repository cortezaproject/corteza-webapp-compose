<template>
  <div class="h-100 p-3">
    <b-card
      no-body
      class="h-100 border-0 shadow rounded-lg overflow-auto"
      :class="blockClass"
      :header="block.title"
      :sub-title="block.description"
      header-class="sticky-top h5"
      :header-bg-variant="block.style.variants.headerBg"
      :header-text-variant="block.style.variants.headerText"
      :header-border-variant="block.style.variants.border"
      :body-bg-variant="block.style.variants.bodyBg">
      <div class="p-0 m-0">
        <slot name="toolbar"/>
      </div>
      <b-card-body class="p-0">
        <slot name="body"/>
      </b-card-body>
      <b-card-footer class="p-0">
        <slot name="footer"/>
      </b-card-footer>
    </b-card>
  </div>
</template>
<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
  props: {
    block: {
      type: compose.PageBlock,
      required: true,
    },
  },

  computed: {
    blockClass () {
      return [
        'block',
        this.block.kind,
      ]
    },
  },
}
</script>
