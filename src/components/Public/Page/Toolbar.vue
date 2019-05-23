<template>
  <div class="toolbar text-center">
    <b-button variant="link" class="float-left" @click.prevent="$router.back()">&#171; {{ $t('general.label.backWithoutSave') }}</b-button>
    <confirmation-toggle v-if="!hideDelete" @confirmed="$emit('delete')" class="confirmation">{{ $t('general.label.delete') }}</confirmation-toggle>
    <slot></slot>
  </div>
</template>
<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'

export default {
  components: {
    ConfirmationToggle,
  },

  props: {
    hideDelete: {
      type: Boolean,
      required: false,
    },
  },
}
</script>
<style scoped lang="scss">

.toolbar {
  background: $white;
  padding: 15px;
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 5;
  border-top: 1px solid $primary;
}
</style>
