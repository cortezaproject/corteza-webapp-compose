<template>
  <swatches
      colors="text-advanced"
      @input="onClick(format.type, { color: $event })">

    <b-button
      slot="trigger"
      variant="link"
      class="text-dark font-weight-bold text-decoration-none">
      <span
        class="icon"
        :class="typeStyle">A</span>
    </b-button>
  </swatches>
</template>

<script>
import base from './base'
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'

/**
 * Component is used to display simple formatter options such as bold, italic, ...
 */
export default {
  name: 'h-item',

  components: {
    Swatches,
  },
  extends: base,
  computed: {
    /**
     * Determines extra styling for color type icon
     * @returns {String}
     */
    typeStyle () {
      return `${this.format.type}-icon`
    },
  },
}
</script>

<style lang="scss" scoped>
// Since we don't have icons for color related formatters,
// this extra styling makes up for that
.icon {
  padding: 0 2px;

  &.color-icon {
    border-bottom: 1px solid $black;
  }

  &.background-icon {
    background-color: rgba($black, 0.07);
    padding: 2px 3px;
  }
}
</style>
