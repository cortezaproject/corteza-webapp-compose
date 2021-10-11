<template>
  <b-container
    fluid
    class="bg-white shadow border-top p-3"
  >
    <b-row
      no-gutters
      class="align-items-center"
    >
      <div class="flex-grow-1">
        <b-button
          v-if="backLink"
          variant="link"
          :to="backLink"
          class="float-left text-dark back"
        >
          <font-awesome-icon
            :icon="['fas', 'chevron-left']"
            class="back-icon"
          />
          {{ $t('label.backWithoutSave') }}
        </b-button>
        <slot />
      </div>
      <div class="flex-grow-1">
        <div
          class="float-right"
        >
          <c-input-confirm
            v-if="!hideDelete"
            size="lg"
            size-confirm="lg"
            variant="danger"
            :borderless="false"
            class="mx-1"
            @confirmed="$emit('delete')"
          >
            {{ $t('label.delete') }}
          </c-input-confirm>
          <b-button
            v-if="!hideClone"
            variant="light"
            size="lg"
            class="mx-1"
            @click="$emit('clone')"
          >
            {{ $t('label.clone') }}
          </b-button>
          <b-button
            v-if="!hideSave"
            :disabled="disableSave"
            variant="light"
            size="lg"
            class="mx-1"
            @click.prevent="$emit('saveAndClose')"
          >
            {{ $t('label.saveAndClose') }}
          </b-button>
          <b-button
            v-if="!hideSave"
            :disabled="disableSave"
            variant="primary"
            size="lg"
            class="mx-1"
            @click.prevent="$emit('save')"
          >
            {{ $t('label.save') }}
          </b-button>
        </div>
      </div>
    </b-row>
  </b-container>
</template>
<script>

export default {
  i18nOptions: {
    namespaces: 'general',
  },

  inheritAttrs: true,

  props: {
    backLink: {
      type: Object,
      required: false,
      default: undefined,
    },
    hideDelete: {
      type: Boolean,
      required: false,
    },
    hideSave: {
      type: Boolean,
      required: false,
    },
    hideClone: {
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
