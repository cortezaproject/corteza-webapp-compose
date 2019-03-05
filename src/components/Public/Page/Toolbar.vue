<template>
  <div class="toolbar">
    <button class="btn-url" @click.prevent="$router.back()">&#171; Back (without saving changes)</button>
    <confirmation-toggle v-if="!hideDelete" @confirmed="$emit('delete')" class="confirmation">Delete</confirmation-toggle>
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
@import '@/assets/sass/_0.commons.scss';
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/components/actions.scss";

.toolbar {
  background: $white;
  padding: 15px;
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 5;
  border-top: 1px solid $appblue;
  text-align: center;

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
