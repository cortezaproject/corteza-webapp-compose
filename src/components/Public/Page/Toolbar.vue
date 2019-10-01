<template>
  <div class="text-center bg-white w-100 fixed-bottom position-sticky border-top border-primary p-3">
    <b-button variant="link"
              class="float-left"
              @click.prevent="$router.back()">
      <span v-if="readOnly">&#171; {{ $t('general.label.back') }}</span>
      <span v-else>&#171; {{ $t('general.label.backWithoutSave') }}</span>
    </b-button>
    <confirmation-toggle v-if="!hideDelete" @confirmed="$emit('delete')" class="confirmation">{{ $t('general.label.delete') }}</confirmation-toggle>
    <slot></slot>
  </div>
</template>
<script>
import ConfirmationToggle from 'corteza-webapp-compose/src/components/Admin/ConfirmationToggle'

export default {
  components: {
    ConfirmationToggle,
  },

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
