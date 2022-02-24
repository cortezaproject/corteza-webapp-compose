<template>
  <b-container
    fluid
    class="bg-white shadow border-top p-3"
  >
    <b-row
      no-gutters
      class="wrap-with-vertical-gutters align-items-center"
    >
      <div
        class="wrap-with-vertical-gutters align-items-center"
      >
        <b-button
          v-if="backLink"
          variant="link"
          :to="backLink"
          class="text-dark back mr-auto"
        >
          <font-awesome-icon
            :icon="['fas', 'chevron-left']"
            class="back-icon"
          />
          {{ $t('label.backWithoutSave') }}
        </b-button>
      </div>
      <div
        class="ml-auto"
      >
        <slot />
      </div>
      <div
        class="d-flex wrap-with-vertical-gutters align-items-center ml-auto"
      >
        <slot name="delete" />
        <c-input-confirm
          v-if="!hideDelete"
          v-b-tooltip.hover
          size="lg"
          size-confirm="lg"
          variant="danger"
          :disabled="disableDelete"
          :title="deleteTooltip"
          :borderless="false"
          @confirmed="$emit('delete')"
        >
          {{ $t('label.delete') }}
        </c-input-confirm>
        <b-button
          v-if="!hideClone"
          variant="light"
          size="lg"
          class="ml-2"
          @click="$emit('clone')"
        >
          {{ $t('label.clone') }}
        </b-button>
        <b-button
          v-if="!hideSave"
          :disabled="disableSave"
          variant="light"
          size="lg"
          class="ml-2"
          @click.prevent="$emit('saveAndClose')"
        >
          {{ $t('label.saveAndClose') }}
        </b-button>
        <b-button
          v-if="!hideSave"
          :disabled="disableSave"
          variant="primary"
          size="lg"
          class="ml-2"
          @click.prevent="$emit('save')"
        >
          {{ $t('label.save') }}
        </b-button>
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
    disableDelete: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableSave: {
      type: Boolean,
      required: false,
      default: false,
    },
    deleteTooltip: {
      type: String,
      required: false,
      default: '',
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

[dir="rtl"] {
  .back {
    .back-icon {
      display: none;
    }
  }
}
</style>
