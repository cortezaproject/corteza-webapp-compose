<template>
  <div class="toolbar text-center">
    <b-button pill variant="link"
      :to="backLink"
      v-if="backLink"
      class="float-left">&#171; {{ $t('general.label.backWithoutSave') }}</b-button>
    <slot></slot>
    <confirmation-toggle v-if="!hideDelete" @confirmed="$emit('delete')" class="confirmation">{{ $t('general.label.delete') }}</confirmation-toggle>
    <b-button v-if="!hideSave" pill variant="primary" @click.prevent="$emit('save')" class="float-right">{{ $t('general.label.save') }}</b-button>
    <b-button v-if="!hideSave" pill variant="primary" @click.prevent="$emit('saveAndClose')" class="float-right mr-1">{{ $t('general.label.saveAndClose') }}</b-button>
  </div>
</template>
<script>
import ConfirmationToggle from 'corteza-webapp-compose/src/components/Admin/ConfirmationToggle'

export default {
  components: {
    ConfirmationToggle,
  },

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
  },
}
</script>
<style lang="scss" scoped>
// @todo to be removed, should be part of general style
@import "corteza-webapp-compose/src/themes/corteza-base/components/actions.scss";

.toolbar {
  background: $white;
  padding: 15px;
  width: 100%;
  z-index: 5;
  border-top: 1px solid $primary;
  position: fixed;
  bottom: 0;
}
</style>
