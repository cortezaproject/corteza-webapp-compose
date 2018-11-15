<template>

  <div class="done-button">
    <button :disabled="layout.length <= 0" @click="handleSaveButtonClick">Done (save layouts)</button>
  </div>

</template>
<script>

export default {
  name: 'DoneButton',
  props: {
    layout: null,
  },
  methods: {
    handleSaveButtonClick () {
      this.$emit('saved', {
      })
    },
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
