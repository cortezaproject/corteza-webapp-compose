<template>
  <b-container
    fluid
    class="bg-white shadow border-top py-3 px-3 m-0"
  >
    <b-row
      no-gutters
    >
      <b-col
        cols="4"
        class="d-flex justify-content-start align-items-center"
      >
        <b-button
          variant="link"
          class="text-dark"
          :disabled="processing"
          @click.prevent="$emit('back')"
        >
          <font-awesome-icon :icon="['fas', 'chevron-left']"></font-awesome-icon>
          {{ $t('general.label.back') }}
        </b-button>
      </b-col>
      <b-col
        cols="4"
        class="d-flex justify-content-center align-items-center"
      >
        <b-button
          v-if="module.canCreateRecord && !hideClone && record"
          variant="light"
          :disabled="processing"
          class="m-1"
          @click.prevent="$emit('clone')"
        >
          {{ $t('general.label.clone') }}
        </b-button>

        <b-button
          v-if="module.canCreateRecord && !hideAdd"
          variant="light"
          :disabled="processing"
          class="m-1"
          @click.prevent="$emit('add')"
        >
          {{ $t('general.label.addNew') }}
        </b-button>
      </b-col>
      <b-col
        v-if="module && record && !isDeleted"
        cols="4"
        class="d-flex justify-content-end align-items-center"
      >
        <c-input-confirm
          :disabled="disableDelete"
          @confirmed="$emit('delete')"
          class="m-1"
        >
          {{ $t('general.label.delete') }}
        </c-input-confirm>

        <b-button
          v-if="inEditing"
          :disabled="!canSave || processing"
          class="m-1"
          variant="primary"
          @click.prevent="$emit('submit')"
        >
          {{ $t('general.label.save') }}
        </b-button>

        <b-button
          v-else
          :disabled="!module.canUpdateRecord"
          variant="light"
          class="m-1"
          @click.prevent="$emit('edit')"
        >
          {{ $t('general.label.edit') }}
        </b-button>
      </b-col>
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
