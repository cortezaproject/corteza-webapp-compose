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
      <b-input-group>
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
        <b-input-group-append>
          <b-button
            :disabled="!value.cap.configurable"
            @click.prevent="$emit('edit')"
            class="px-2"
            variant="secondary"
          >
            <font-awesome-icon
              :icon="['fas', 'wrench']"
            />
          </b-button>
        </b-input-group-append>
      </b-input-group>
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
      class="text-right align-middle"
      style="min-width: 100px;"
    >
      <c-input-confirm
        @confirmed="$emit('delete')"
        :no-prompt="!value.name"
        class="mr-2"
      />
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

export default {
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
