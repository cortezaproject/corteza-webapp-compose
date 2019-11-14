<template>
  <editor-menu-bar
    :editor="editor"
    v-slot="{ commands, isActive }">

    <b-button-group class="flex-wrap">
      <component
        v-for="(f, i) of formats"
        :key="`${f.name}${i}}`"
        :is="getItem(f)"
        :format="f"
        :is-active="isActive"
        @click="(commands[$event.type])($event.attrs)" />

      <!-- Extra button to remove formatting -->
      <b-button
        variant="link"
        class="text-dark font-weight-bold"
        @click="removeMarks">

        <font-awesome-icon icon="remove-format" />
      </b-button>
    </b-button-group>
  </editor-menu-bar>
</template>

<script>
import { EditorMenuBar } from 'tiptap'
import { TItem, TItemVariants } from './loader'
import { removeMark } from 'tiptap-commands'

export default {
  components: {
    EditorMenuBar,
    TItem,
    TItemVariants,
  },

  props: {
    editor: {
      type: Object,
      required: true,
      default: () => ({}),
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
