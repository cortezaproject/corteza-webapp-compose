<template>
  <b-card
    class="h-100 border-0"
    :class="blockClass"
    :header="block.title"
    :sub-title="block.description"
    header-class="sticky-top p-2"
    :header-bg-variant="block.style.variants.headerBg"
    :header-text-variant="block.style.variants.headerText"
    :body-bg-variant="block.style.variants.bodyBg">
    <div>
      <component :is="block.kind"
                 :options="block.options"
                 v-bind="$props"
                 v-on="$listeners" />
    </div>
  </b-card>
</template>

<script>
import * as EditBlocks from './loader'

export default {
  components: {
    ...EditBlocks,
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
      required: true,
    },

    record: {
      type: Object,
      required: false,
    },
  },

  computed: {
    blockClass () {
      let c = ['block', this.block.kind]

      if (this.block.theme) {
        c.push('theme-' + this.block.theme)
      }

      return c
    },
  },
}
</script>
