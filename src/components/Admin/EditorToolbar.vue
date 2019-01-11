<template>
  <div class="toolbar">
    <router-link
      :to="backLink"
      v-if="backLink"
      class="btn-url">&#171; Back (without saving changes)</router-link>
    <slot></slot>
    <confirmation-toggle v-if="!hideDelete" @confirmed="$emit('delete')" class="confirmation">Delete</confirmation-toggle>
    <button type="submit" @click.prevent="$emit('save')" class="btn btn-blue">Save</button>
    <button type="button" @click.prevent="$emit('saveAndClose')" class="btn btn-blue">Save and close</button>
  </div>
</template>
<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'

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
  },
  components: {
    ConfirmationToggle,
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
