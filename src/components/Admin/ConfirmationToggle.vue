<template>
  <span>
    <span v-if="!inConfirmation">
      <b-button variant="outline-danger" size="sm" @click.prevent="onPrompt" :disabled="disabled"><slot></slot></b-button>
    </span>
    <span v-if="inConfirmation">
      <b-button variant="danger" size="sm" class="mr-1" @click.prevent="onConfirmation()">{{ $t('general.label.yes') }}</b-button>
      <b-button size="sm" @click.prevent="inConfirmation=false">{{ $t('general.label.no') }}</b-button>
    </span>
  </span>
</template>
<script>
export default {
  props: {
    ctaClass: { type: String, default: 'btn-danger' },
    disabled: Boolean,
    noPrompt: Boolean,
  },

  data () {
    return {
      inConfirmation: false,
    }
  },

  computed: {
    btnClass () {
      if (this.disabled) {
        return 'btn-disabled'
      }

      return this.ctaClass
    },
  },

  methods: {
    onPrompt () {
      if (this.noPrompt) {
        this.$emit('confirmed')
      } else {
        this.inConfirmation = true
      }
    },

    onConfirmation () {
      this.inConfirmation = false
      this.$emit('confirmed')
    },
  },
}
</script>
