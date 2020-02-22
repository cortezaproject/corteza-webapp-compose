<template>
  <div class="text-center bg-white w-100 fixed-bottom border-top border-primary p-3">
  <b-button variant="link"
            :to="backLink"
            v-if="backLink"
            class="float-left">&#171; {{ $t('general.label.backWithoutSave') }}</b-button>
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
            variant="primary" @click.prevent="$emit('saveAndClose')"
            class="float-right mr-1">{{ $t('general.label.saveAndClose') }}</b-button>
</div>
</template>
<script>

export default {
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
