<template>
  <div class="text-center bg-white w-100 fixed-bottom position-sticky border-top border-primary p-3">
    <b-button variant="link"
              class="float-left"
              @click.prevent="$router.back()">
      <span v-if="readOnly">&#171; {{ $t('general.label.back') }}</span>
      <span v-else>&#171; {{ $t('general.label.backWithoutSave') }}</span>
    </b-button>
    <c-input-confirm
      v-if="!hideDelete"
      @confirmed="$emit('delete')"
      size="md"
      :borderless="false"
    >
      {{ $t('general.label.delete') }}
    </c-input-confirm>
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    readOnly: {
      type: Boolean,
      required: false,
    },

    hideDelete: {
      type: Boolean,
      required: false,
    },
  },
}
</script>
