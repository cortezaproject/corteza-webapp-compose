<template>
  <b-container
    fluid
    class="bg-white shadow border-top p-3"
  >
    <b-row no-gutters
           class="align-items-center">
      <div class="flex-grow-1">
        <b-button variant="link"
                  :to="backLink"
                  v-if="backLink"
                  class="float-left text-dark back">
          <font-awesome-icon :icon="['fas', 'chevron-left']" class="back-icon"></font-awesome-icon>
          {{ $t('general.label.backWithoutSave') }}
        </b-button>
        <slot />
      </div>
      <div class="d-flex flex-grow-1 justify-content-end text-nowrap">
        <c-input-confirm
          v-if="!hideDelete"
          @confirmed="$emit('delete')"
          size="lg"
          sizeConfirm="lg"
          variant="danger"
          :borderless="false"
          class="mx-1"
        >
          {{ $t('general.label.delete') }}
        </c-input-confirm>
        <b-button v-if="!hideSave"
                  :disabled="disableSave"
                  variant="light" @click.prevent="$emit('saveAndClose')"
                  size="lg"
                  class="mx-1">
          {{ $t('general.label.saveAndClose') }}
        </b-button>
        <b-button v-if="!hideSave"
                  :disabled="disableSave"
                  variant="primary"
                  size="lg"
                  @click.prevent="$emit('save')"
                  class="mx-1">
          {{ $t('general.label.save') }}
        </b-button>
      </div>
    </b-row>
  </b-container>
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
