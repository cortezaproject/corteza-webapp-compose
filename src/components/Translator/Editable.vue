<template>
  <div
    v-once
    class="m-1 p-2 text-break"
    contenteditable="true"
    :value="value"
    :placeholder="placeholder"
    @input="$emit('input', $event.target.innerHTML)"
    v-html="value"
  />
</template>
<script lang="js">
export default {
  // inspired by:
  // https://forum.vuejs.org/t/v-html-prevent-dom-refresh/3125/5
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  watch: {
    value (newValue) {
      if (document.activeElement === this.$el) {
        return
      }

      this.$el.innerHTML = newValue
    },
  },
}
</script>
<style lang="scss" scoped>
div {
  cursor: text;
}

div:empty::before {
  content: attr(placeholder);
  color: $secondary;
  pointer-events: none;
  display: block; /* For Firefox */
}
</style>
