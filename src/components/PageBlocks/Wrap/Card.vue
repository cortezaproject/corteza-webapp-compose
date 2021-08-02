<template>
  <div class="h-100 p-2 overflow-hidden">
    <b-card
      no-body
      class="h-100 border-0 shadow-sm"
      :class="blockClass"
      header-class="sticky-top border-0 text-nowrap text-truncate px-3"
      header-bg-variant="white"
      header-tag="h5"
      :header-text-variant="block.style.variants.headerText"
      :header="headerSet ? '' : block.title"
    >
      <b-card-header
        v-if="headerSet"
        class="sticky-top border-0 text-nowrap text-truncate px-3"
        header-bg-variant="white"
        header-tag="h5"
        :header-text-variant="block.style.variants.headerText"
      >
        <slot
          name="header"
        />
      </b-card-header>
      <b-card-text
        v-if="block.description"
        class="px-3 pb-2 text-truncate m-0"
      >
        {{ block.description }}
      </b-card-text>
      <div
        v-if="toolbarSet"
      >
        <slot
          name="toolbar"
        />
      </div>
      <b-card-body
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
