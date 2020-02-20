<template>
  <tr>
    <td
      v-b-tooltip.hover
      class="handle text-center align-middle"
    >
      <font-awesome-icon
        :icon="['fas', 'sort']"
        class="text-secondary"
      />
    </td>
    <td>
      <b-form-input
        v-model="value.name"
        required
        :readonly="disabled"
        :state="checkFieldName"
        type="text"
        class="form-control"
      />
    </td>
    <td>
      <b-input
        v-model="value.label"
        type="text"
        class="form-control"
      />
    </td>
    <td>
      <b-select
        v-model="value.kind"
        :disabled="disabled"
      >
        <option
          v-for="({ kind, label }) in fieldKinds"
          :key="kind"
          :value="kind">
          {{ label }}
        </option>
      </b-select>
    </td>
    <td
      class="text-center align-middle"
    >
      <b-form-checkbox
        v-model="value.isMulti"
        :disabled="!value.cap.multi"
        :value="true"
        :unchecked-value="false"
      />
    </td>
    <td
      class="text-center align-middle"
    >
      <b-form-checkbox
        v-model="value.isRequired"
        :disabled="!value.cap.required"
        :value="true"
        :unchecked-value="false"
      />
    </td>
    <td
      class="text-center align-middle"
    >
      <b-form-checkbox
        v-model="value.isPrivate"
        :disabled="!value.cap.private"
        :value="true"
        :unchecked-value="false"
      />
    </td>
    <td
      class="d-flex justify-content-around align-items-center mt-1"
    >
      <b-button
        :disabled="!value.cap.configurable"
        @click.prevent="$emit('edit')"
        class="pl-1 pr-0 text-secondary"
        variant="link"
      >
        <font-awesome-icon
          :icon="['fas', 'wrench']"
        />
      </b-button>
      <c-input-confirm
        @confirmed="$emit('delete')"
        :no-prompt="!value.name"
        class="confirmation-small"
      >
        <font-awesome-icon
          :icon="['far', 'trash-alt']"
        />
        <template v-slot:yes>
          {{ $t('general.label.yes') }}
        </template>
        <template v-slot:no>
          {{ $t('general.label.no') }}
        </template>
      </c-input-confirm>
      <c-permissions-button
        v-if="canGrant"
        :title="value.name"
        :resource="'compose:module-field:'+value.fieldID"
        link
      />
    </td>
  </tr>
</template>

<script>
import { compose } from '@cortezaproject/corteza-js'
import { components } from '@cortezaproject/corteza-vue'
const { CInputConfirm } = components

export default {
  components: {
    CInputConfirm,
  },

  i18nOptions: {
    keyPrefix: 'module.fieldKinds',
  },

  props: {
    value: {
      type: Object,
      required: true,
    },

    canGrant: {
      type: Boolean,
      required: false,
    },

    hasRecords: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data () {
    return {
      updateField: null,
      module: null,
    }
  },

  computed: {
    checkFieldName () {
      return (this.disabled || this.value.isValid) ? null : false
    },

    disabled () {
      return this.value.fieldID !== '0' && this.hasRecords
    },

    fieldKinds () {
      return [...compose.ModuleFieldRegistry.keys()].map(kind => {
        return { kind, label: this.$t(kind + '.label') }
      })
    },
  },

  methods: {
    handleKindChange (field) {
      field.merge({ kind: field.kind })
    },
  },
}
</script>
<style lang="scss" scoped>
.confirmation-small {
  min-width: 80px;

  /deep/.btn-outline-danger {
    border: none;
  }
}
</style>
