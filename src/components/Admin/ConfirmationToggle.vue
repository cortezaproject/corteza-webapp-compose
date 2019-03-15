<template>
  <span>
    <span v-if="!inConfirmation">
      <button type="button" class="btn" :class="btnClass" @click.prevent="onPrompt" :disabled="disabled"><slot></slot></button>
    </span>
    <span v-if="inConfirmation">
      <button type="button" class="btn" :class="confirmationClass" @click.prevent="onConfirmation()">{{ $t('general.label.yes') }}</button>
      <button type="button" class="btn" @click.prevent="inConfirmation=false">{{ $t('general.label.no') }}</button>
    </span>
  </span>
</template>
<script>
export default {
  props: {
    ctaClass: { type: String, default: 'btn-danger' },
    confirmationClass: { default: 'btn-danger' },
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
<style scoped lang="scss">
@import '@/assets/sass/_0.commons.scss';
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/components/actions.scss";

.btn {
  margin: 0 1px;
}

.btn-url {
  color: $appred;
  text-decoration: none;

  &:hover {
    color: $appred;

    .icon-trash {
      font-weight: 900;
    }
  }
}
</style>
