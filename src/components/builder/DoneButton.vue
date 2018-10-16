<template>

  <div class="done-button">
    <button v-if="!mobilePreview" @click="handleMobilePreviewButtonClick">Done (mobile preview)</button>
    <button v-if="mobilePreview" @click="handleDoneButtonClick">Done (save layouts)</button>
  </div>

</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DoneButton',

  computed: {
    ...mapState({
      layout: state => state.builder.layout,
      mobilePreview: state => state.builder.mobilePreview,
    }),
  },

  methods: {
    ...mapActions('builder', ['handleMobilePreviewButtonClick', 'handleDoneButtonClick']),
  },

}
</script>
<style lang="scss" scoped>
.done-button {
  z-index: 999;
  padding: 1em;
  background: lightgrey;
  position: absolute;
  bottom: 2em;
  right: 2em;
  border-radius: 1em;
}
</style>
