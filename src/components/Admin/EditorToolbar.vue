<template>
  <div class="text-center bg-white shadow border-top py-3 px-3 m-0 container-fluid">
  <b-button variant="link"
            :to="backLink"
            v-if="backLink"
            class="float-left text-dark back">
    <font-awesome-icon :icon="['fas', 'chevron-left']" class="back-icon"></font-awesome-icon>
    {{ $t('general.label.backWithoutSave') }}
  </b-button>
  <slot />

  <c-input-confirm
    v-if="!hideDelete"
    @confirmed="$emit('delete')"
    size="md"
    :borderless="false"
  >
    {{ $t('general.label.delete') }}
  </c-input-confirm>

  <b-button v-if="!hideSave"
            :disabled="disableSave"
            variant="primary"
            @click.prevent="$emit('save')"
            class="float-right">{{ $t('general.label.save') }}</b-button>
  <b-button v-if="!hideSave"
            :disabled="disableSave"
            variant="light" @click.prevent="$emit('saveAndClose')"
            class="float-right mr-1">{{ $t('general.label.saveAndClose') }}</b-button>
</div>
</template>
<script>

export default {
  inheritAttrs: true,

  props: {
    backLink: {
      type: Object,
      required: false,
    },
    hideDelete: {
      type: Boolean,
      required: false,
    },
    hideSave: {
      type: Boolean,
      required: false,
    },
    disableSave: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
.back {
  &:hover {
    text-decoration: none;

    .back-icon {
      transition: transform 0.3s ease-out;
      transform: translateX(-4px);
    }
  }
}
</style>
