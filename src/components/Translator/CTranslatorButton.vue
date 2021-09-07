<template>
  <b-button
    :variant="buttonVariant"
    :class="buttonClass"
    @click="onClick"
  >
    <slot>
      <font-awesome-icon :icon="['fas', 'language']" />
    </slot>
  </b-button>
</template>
<script lang="js">
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'

library.add(faLanguage)

export default {
  props: {
    buttonVariant: {
      type: String,
      default: () => { return 'primary' },
    },

    buttonClass: {
      type: String,
      default: () => { return '' },
    },

    resource: {
      type: String,
      required: true,
    },

    titles: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    onClick () {
      this.$root.$emit('c-translator', {
        resource: this.resource,
        titles: this.titles,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
</style>
