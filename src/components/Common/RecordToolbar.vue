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
          :disabled="disableDelete"
          @confirmed="$emit('delete')"
          class="mx-1"
          size="lg"
          variant="danger"
          :borderless="false"
        >
          {{ $t('general.label.delete') }}
        </c-input-confirm>
        <b-button
          v-if="module.canCreateRecord && !hideClone && record"
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
          :disabled="!module.canUpdateRecord"
          variant="light"
          size="lg"
          class="mx-1"
          @click.prevent="$emit('edit')"
        >
          {{ $t('general.label.edit') }}
        </b-button>
        <b-button
          v-if="module.canCreateRecord && !hideAdd"
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
          {{ $t('general.label.save') }}
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
      if (this.record) {
        return this.record.recordID === '0' ? this.module.canCreateRecord : this.module.canUpdateRecord
      }

      return false
    },

    disableDelete () {
      return this.isDeleted || !this.module.canDeleteRecord || this.processing || this.record.recordID === NoID
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
