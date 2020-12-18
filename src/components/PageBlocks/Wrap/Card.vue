<template>
  <div class="h-100 p-2 overflow-hidden">
    <b-card
      no-body
      class="h-100 border-0 shadow-sm rounded-lg"
      :class="blockClass"
      header-class="sticky-top h5 px-2"
      :header="headerSet ? '' : block.title"
      :header-bg-variant="block.style.variants.headerBg"
      :header-text-variant="block.style.variants.headerText"
      :header-border-variant="block.style.variants.border"
    >
      <b-card-header
        v-if="headerSet"
        class="sticky-top h5 px-2"
        :header-bg-variant="block.style.variants.headerBg"
        :header-text-variant="block.style.variants.headerText"
        :header-border-variant="block.style.variants.border"
      >
        <slot
          name="header"
        />
      </b-card-header>
      <b-card-text
        v-if="block.description"
        class="p-2 m-0"
      >
        {{ block.description }}
      </b-card-text>
      <div
        v-if="toolbarSet"
        class="p-0 m-0"
      >
        <slot
          name="toolbar"
        />
      </div>
      <b-card-body
        :body-bg-variant="block.style.variants.bodyBg"
        class="p-0"
        :class="{ 'overflow-auto': scrollableBody }"
      >
        <slot
          name="default"
        />
      </b-card-body>
      <b-card-footer
        v-if="footerSet"
        class="p-0"
      >
        <slot
          name="footer"
        />
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

    scrollableBody: {
      type: Boolean,
      required: false,
      default: () => true,
    },
  },

  computed: {
    blockClass () {
      return [
        'block',
        this.block.kind,
      ]
    },

    headerSet () {
      return !!this.$scopedSlots.header
    },

    toolbarSet () {
      return !!this.$scopedSlots.toolbar
    },

    footerSet () {
      return !!this.$scopedSlots.footer
    },
  },
}
</script>
