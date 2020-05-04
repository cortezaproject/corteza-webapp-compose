<template>
  <b-container
    fluid
    class="bg-white shadow border-top py-3 px-3 m-0"
  >
    <b-row
      no-gutters
    >
      <b-col cols="4">
        <b-button
          variant="link"
          @click.prevent="$emit('back')"
        >
          &#171; {{ $t('general.label.back') }}
        </b-button>
      </b-col>
      <b-col
        cols="4"
        class="text-center"
      >
        <b-button
          v-if="module.canCreateRecord"
          variant="outline-secondary"
          class="m-1"
          @click.prevent="$emit('clone')"
        >
          {{ $t('general.label.clone') }}
        </b-button>

        <b-button
          v-if="module.canCreateRecord"
          variant="outline-secondary"
          class="m-1"
          @click.prevent="$emit('add')"
        >
          {{ $t('general.label.addNew') }}
        </b-button>
      </b-col>
      <b-col
        cols="4"
        class="text-right"
      >
        <c-input-confirm
          :disabled="!module.canDeleteRecord || isDeleted"
          @confirmed="$emit('delete')"
          class="m-1"
        >
          {{ $t('general.label.delete') }}
        </c-input-confirm>

        <b-button
          v-if="module.canUpdateRecord && !isDeleted && !inEditing"
          variant="outline-secondary"
          class="m-1"
          @click.prevent="$emit('edit')"
        >
          {{ $t('general.label.edit') }}
        </b-button>

        <b-button
          v-else-if="module.canUpdateRecord"
          :disabled="!isValid || isDeleted"
          class="m-1"
          variant="primary"
          @click.prevent="$emit('submit')"
        >
          {{ $t('general.label.save') }}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
  props: {
    module: {
      type: compose.Module,
      required: false,
    },

    isValid: {
      type: Boolean,
      required: true,
    },

    inEditing: {
      type: Boolean,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
