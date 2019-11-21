<template>
  <div class="d-flex flex-wrap">
    <component
      v-for="(f, i) of formats"
      :key="`${f.name}${i}}`"
      :is="getItem(f)"
      :format="f"
      v-bind="$props"
      @click="(commands[$event.type])($event.attrs)" />

    <!-- Extra button to remove formatting -->
    <b-button
      variant="link"
      class="text-dark font-weight-bold"
      @click="removeMarks">

      <font-awesome-icon icon="remove-format" />
    </b-button>
  </div>
</template>

<script>
import { TItem, TItemVariants, TColors, TLink } from './loader'
import { removeMark } from 'tiptap-commands'

export default {
  components: {
    TItem,
    TItemVariants,
    TLink,
  },

  props: {
    commands: {
      type: Object,
      required: true,
    },
    isActive: {
      type: Object,
      required: true,
    },
    getMarkAttrs: {
      type: Function,
      required: true,
    },
    formats: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  methods: {
    /**
     * Helper method to determine what item type we should display.
     * It can be a simple button (bold, italic, ...) or a dropdown (alignment)
     * @param {Object} f Format in question
     * @returns {Component}
     */
    getItem (f) {
      if (f.variants) {
        return TItemVariants
      }
      if (f.colorPicker) {
        return TColors
      }
      if (f.type === 'link') {
        return TLink
      }
      return TItem
    },

    /**
     * Helper method for removing marks.
     * It will remove all marks from the current state's range.
     * @returns {Range}
     */
    removeMarks () {
      removeMark(null)(this.editor.view.state, this.editor.view.dispatch)
    },
  },
}
</script>
