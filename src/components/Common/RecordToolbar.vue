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
          variant="link"
          class="text-dark back"
          :disabled="processing"
          @click.prevent="$emit('back')"
        >
          <font-awesome-icon
            :icon="['fas', 'chevron-left']"
            class="back-icon"
          />
          {{ $t('label.back') }}
        </b-button>
      </div>

      <div
        v-if="module"
        class="d-flex wrap-with-vertical-gutters align-items-center ml-auto"
      >
        <c-input-confirm
          v-if="isCreated"
          :disabled="!canDeleteRecord"
          size="lg"
          size-confirm="lg"
          variant="danger"
          :borderless="false"
          @confirmed="$emit('delete')"
        >
          <b-spinner
            v-if="processingDelete"
            small
            type="grow"
          />

          <span v-else>
            {{ $t('label.delete') }}
          </span>
        </c-input-confirm>

        <b-button
          v-if="module.canCreateRecord && !hideClone && isCreated"
          variant="light"
          size="lg"
          :disabled="!record || processing"
          class="ml-2"
          @click.prevent="$emit('clone')"
        >
          {{ $t('label.clone') }}
        </b-button>

        <b-button
          v-if="!inEditing"
          :disabled="!record || !record.canUpdateRecord || processing"
          variant="light"
          size="lg"
          class="ml-2"
          @click.prevent="$emit('edit')"
        >
          {{ $t('label.edit') }}
        </b-button>

        <b-button
          v-if="module.canCreateRecord && !hideAdd && !inEditing"
          variant="primary"
          size="lg"
          :disabled="processing"
          class="ml-2"
          @click.prevent="$emit('add')"
        >
          {{ $t('label.addNew') }}
        </b-button>

        <b-button
          v-if="inEditing"
          :disabled="!canSaveRecord || processing"
          class="d-flex align-items-center justify-content-center ml-2"
          variant="primary"
          size="lg"
          @click.prevent="$emit('submit')"
        >
          <b-spinner
            v-if="processingSubmit"
            small
            type="grow"
          />

          <span
            v-else
            data-test-id="button-save"
          >
            {{ $t('label.save') }}
          </span>
        </b-button>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import { compose, NoID } from '@cortezaproject/corteza-js'

export default {
  i18nOptions: {
    namespaces: 'general',
  },

  props: {
    module: {
      type: compose.Module,
      required: false,
      default: undefined,
    },

    record: {
      type: compose.Record,
      required: false,
      default: undefined,
    },

    processing: {
      type: Boolean,
      default: false,
    },

    processingDelete: {
      type: Boolean,
      default: false,
    },

    processingSubmit: {
      type: Boolean,
      default: false,
    },

    inEditing: {
      type: Boolean,
      required: true,
    },

    hideClone: {
      type: Boolean,
      default: () => false,
    },

    hideAdd: {
      type: Boolean,
      default: () => false,
    },

    isDeleted: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    isCreated () {
      return this.record && this.record.recordID !== NoID
    },

    canSaveRecord () {
      if (!this.module || !this.record) {
        return false
      }

      return this.record.recordID === NoID
        ? this.module.canCreateRecord
        : this.record.canUpdateRecord
    },

    canDeleteRecord () {
      if (!this.module || !this.record) {
        return false
      }

      return !this.isDeleted && this.record.canDeleteRecord && !this.processing && this.record.recordID !== NoID
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
