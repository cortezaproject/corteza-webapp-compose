<template>
  <tr>
    <td
      v-b-tooltip.hover
      class="handle align-middle"
    >
      <font-awesome-icon
        :icon="['fas', 'bars']"
        class="text-light grab"
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
      <b-input-group class="field-type">
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
            variant="light"
          >
            <font-awesome-icon
              :icon="['fas', 'wrench']"
            />
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </td>
    <td
      class="align-middle pl-2 text-nowrap"
    >
      <b-form-checkbox
        v-model="value.isMulti"
        :disabled="!value.cap.multi"
        :value="true"
        :unchecked-value="false"
      >
        {{ $t('general.label.multi') }}
      </b-form-checkbox>
    </td>
    <td
      class="align-middle"
    >
      <b-form-checkbox
        v-model="value.isRequired"
        :disabled="!value.cap.required"
        :value="true"
        :unchecked-value="false"
      >
        {{ $t('general.label.required') }}
      </b-form-checkbox>
    </td>
    <td
      v-if="false"
      class="align-middle"
    >
      <b-form-checkbox
        v-model="value.isPrivate"
        :disabled="!value.cap.private"
        :value="true"
        :unchecked-value="false"
      >
        {{ $t('general.label.private') }}
      </b-form-checkbox>
    </td>
    <td
      class="text-right align-middle pr-2"
      style="min-width: 100px;"
    >
      <c-input-confirm
        @confirmed="$emit('delete')"
        :no-prompt="!value.name"
        class="mr-2"
      />
      <c-permissions-button
        v-if="canGrant"
        class="text-dark px-0"
        buttonVariant="link"
        :title="value.name"
        :target="value.name"
        :resource="`corteza::compose:module-field/${module.namespaceID}/${module.moduleID}/${value.fieldID}`"
      />
    </td>
  </tr>
</template>

<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },

    module: {
      type: compose.Module,
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
      return [...compose.ModuleFieldRegistry.keys()]
        // for now this field is hidden, since it's implementation is mia.
        .map(kind => {
          return { kind, label: this.$t('module.fieldKinds.' + kind + '.label') }
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
td {
  input,
  .field-type {
    min-width: 150px;
  }

  .handle {
    width: 30px;
  }
}
</style>
