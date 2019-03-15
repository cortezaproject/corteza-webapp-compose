<template>
  <div class="toolbar">
    <router-link
      :to="backLink"
      v-if="backLink"
      class="btn-url">&#171; {{ $t('general.label.backWithoutSave') }}</router-link>
    <slot></slot>
    <confirmation-toggle v-if="!hideDelete" @confirmed="$emit('delete')" class="confirmation">{{ $t('general.label.delete') }}</confirmation-toggle>
    <button type="submit" @click.prevent="$emit('save')" class="btn btn-blue">{{ $t('general.label.save') }}</button>
    <button type="button" @click.prevent="$emit('saveAndClose')" class="btn btn-blue">{{ $t('general.label.saveAndClose') }}</button>
  </div>
</template>
<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'

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
  },
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/_0.commons.scss';
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/components/actions.scss";

.toolbar {
  background: $white;
  padding: 25px;
  width: 100%;
  z-index: 5;
  border-top: 1px solid $appblue;
  text-align: center;
  position: fixed;
  bottom: 0;

  .btn-url {
    float: left;
  }

  .btn-blue {
    float: right;
    margin-left: 0.5em;
  }
}

.confirmation {
  margin-right: 0.5em;
}
</style>
