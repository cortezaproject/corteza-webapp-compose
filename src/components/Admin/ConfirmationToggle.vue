<template>
  <span>
    <span v-if="!inConfirmation">
      <button class="btn" :class="btnClass" @click="inConfirmation=true" :disabled="disabled"><slot></slot></button>
    </span>
    <span v-if="inConfirmation">
      <button class="btn" :class="btnClass" @click="onConfirmation()">Yes</button>
      <button class="btn" @click="inConfirmation=false">Cancel</button>
    </span>
  </span>
</template>
<script>
export default {
  props: {
    ctaClass: { type: String, default: 'danger' },
    disabled: Boolean,
  },

  computed: {
    btnClass () {
      if (this.disabled) {
        return 'btn-disabled'
      }

      return `btn-${this.ctaClass}`
    },
  },

  data () {
    return {
      inConfirmation: false,
    }
  },

  methods: {
    onConfirmation () {
      this.inConfirmation = false
      this.$emit('confirmed')
    },
  },
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/_0.commons.scss';
@import "@/assets/sass/btns.scss";

.btn {
  margin: 0 1px;
}
</style>
