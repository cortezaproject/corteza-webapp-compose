<template>
  <div>
    <div :class="{ 'disabled': disabled, 'small': small }"
         class="h3 mx-auto rounded-circle circle border-primary text-primary text-center mb-5"
         v-b-popover.hover.top="popoverContent">
      <font-awesome-icon v-if="done" :icon="['fas', 'check']" />
      <span v-else>{{ stepNumber }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    done: {
      type: Boolean,
      required: true,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    optional: {
      type: Boolean,
      default: false,
    },

    stepNumber: {
      type: String,
      default: '?',
    },

    small: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    popoverContent () {
      if (this.optional) {
        return this.$t('onboarding.step.optional')
      } else {
        // If popover content is an empty string it doesnt show
        return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.circle {
  width: 75px;
  height: 75px;
  font-size: 35px;
  line-height: 75px;
  border: 2px solid;
}

.small {
  width: 50px;
  height: 50px;
  font-size: 25px;
  line-height: 45px;
}

.disabled {
  opacity: 0.65;
}
</style>
