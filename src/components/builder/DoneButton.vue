<template>

  <div class="done-button">
    <button @click="handleDoneButtonClick">Done</button>
  </div>

</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DoneButton',

  computed: {
    ...mapState({
      layout: state => state.builder.layout,
    }),
  },

  methods: {
    ...mapActions('builder', ['handleDoneButtonClick']),
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
}
</style>
