<template>
  <div :class="blockClass">
    <div class="block-data">
      <h2>{{ block.title }}</h2>
      <p class="block-data-description" v-if="block.description">{{ block.description }}</p>
      <div class="block-data-content">
        <component :is="block.kind"
                   :options="block.options"
                   :page="page"
                   :module="module"
                   :record="record" />
      </div>
    </div>
  </div>
</template>

<script>
import * as ViewBlocks from './loader'

export default {
  props: {
    block: {
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

  components: {
    ...ViewBlocks,
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/components/blocks.scss";

.block-data {
  .block-data-title {
    font-size: 15px;
  }

  .block-data-description {
    font-size: 10px;
    border-bottom: 1px solid black;
  }

  .block-data-content {
    fieldset {
      border: none;
    }
  }

  .block-data-footer {
    font-size: 10px;
    position: absolute;
    bottom: 0;
  }
}
</style>
