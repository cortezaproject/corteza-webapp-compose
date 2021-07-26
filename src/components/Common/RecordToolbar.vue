<template>
  <b-container
    fluid
    class="bg-white shadow border-top p-3">
    <b-row
      no-gutters
      class="align-items-center"
    >
      <div class="flex-grow-1">
        <b-button
          variant="link"
          class="text-dark back"
          :disabled="processing"
          @click.prevent="$emit('back')"
        >
          <font-awesome-icon :icon="['fas', 'chevron-left']" class="back-icon"></font-awesome-icon>
          {{ $t('general.label.back') }}
        </b-button>
      </div>
      <div class="d-flex flex-grow-1 justify-content-end text-nowrap">
        <c-input-confirm
          :disabled="!canDeleteRecord"
          @confirmed="$emit('delete')"
          class="mx-1"
          size="lg"
          sizeConfirm="lg"
          variant="danger"
          :borderless="false"
        >
          <b-spinner
            v-if="processingDelete"
            small
            type="grow"
          />

          <span v-else>
            {{ $t('general.label.delete') }}
          </span>
        </c-input-confirm>
        <b-button
          v-if="module && module.canCreateRecord && !hideClone && record"
          variant="light"
          size="lg"
          :disabled="processing"
          class="mx-1"
          @click.prevent="$emit('clone')"
        >
          {{ $t('general.label.clone') }}
        </b-button>
        <b-button
          v-if="!inEditing"
          :disabled="!record || !record.canUpdateRecord"
          variant="light"
          size="lg"
          class="mx-1"
          @click.prevent="$emit('edit')"
        >
          {{ $t('general.label.edit') }}
        </b-button>
        <b-button
          v-if="module && module.canCreateRecord && !hideAdd && !inEditing"
          variant="primary"
          size="lg"
          :disabled="processing"
          class="mx-1"
          @click.prevent="$emit('add')"
        >
          {{ $t('general.label.addNew') }}
        </b-button>
        <b-button
          v-if="inEditing"
          :disabled="!canSave || processing"
          class="mx-1"
          variant="primary"
          size="lg"
          @click.prevent="$emit('submit')"
        >
          <b-spinner
            v-if="processingSubmit"
            small
            type="grow"
          />

          <span v-else>
            {{ $t('general.label.save') }}
          </span>
        </b-button>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import { compose, NoID } from '@cortezaproject/corteza-js'

export default {
  props: {
    module: {
      type: compose.Module,
      required: false,
    },

    record: {
      type: compose.Record,
      required: false,
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
    canSave () {
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
