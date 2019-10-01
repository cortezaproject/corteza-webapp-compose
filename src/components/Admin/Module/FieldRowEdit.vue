<template>
  <tr>
    <td v-b-tooltip.hover
        :title="$t('general.tooltip.dragAndDrop')"
        class="handle text-center align-middle">
        <font-awesome-icon :icon="['fas', 'sort']"
                           class="text-secondary"
                           :title="$t('module.edit.reorderFields')"></font-awesome-icon>
    </td>
    <td>
      <b-form-input v-model="value.name"
                    required
                    :readonly="disabled"
                    :state="checkFieldName"
                    type="text"
                    class="form-control"></b-form-input>
    </td>
    <td>
      <b-input v-model="value.label"
             type="text"
             class="form-control"/>
    </td>
    <td>
      <b-select v-model="value.kind"
                :disabled="disabled"
                class="w-75">
        <option v-for="fieldType in fieldsList"
                :key="fieldType.kind"
                :value="fieldType.kind">{{ fieldType.label||fieldType.kind }}</option>
      </b-select>
      <b-button :disabled="!value.isConfigurable()"
              @click.prevent="$emit('edit')"
              class="pl-1 pr-0 text-secondary"
              variant="link">
        <font-awesome-icon :icon="['fas', 'wrench']"></font-awesome-icon></b-button>
    </td>
    <td class="text-center align-middle">
      <b-form-checkbox v-model="value.isMulti"
                       :disabled="!value.allowMulti()"
                       :value="true"
                       :unchecked-value="false"></b-form-checkbox>
    </td>
    <td class="text-center align-middle">
      <b-form-checkbox v-model="value.isRequired"
                       :value="true"
                       :unchecked-value="false"></b-form-checkbox>
    </td>
    <td class="text-center align-middle">
      <b-form-checkbox v-model="value.isPrivate"
                       :value="true"
                       :unchecked-value="false"></b-form-checkbox>
    </td>
    <td class="text-right align-middle">
      <confirmation-toggle @confirmed="$emit('delete')"
                           :no-prompt="!value.name"
                           class="confirmation-small">
        <font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>
      </confirmation-toggle>
      <permissions-button v-if="canGrant" :title="value.name" :resource="'compose:module-field:'+value.fieldID" link />
    </td>
  </tr>
</template>

<script>
import ConfirmationToggle from 'corteza-webapp-compose/src/components/Admin/ConfirmationToggle'
import fieldList from 'corteza-webapp-compose/src/lib/field/list'

export default {
  components: {
    ConfirmationToggle,
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
      fieldsList: fieldList,
    }
  },

  computed: {
    checkFieldName () {
      if (this.disabled) {
        return null
      }

      return this.value.name.length > 1 && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(this.value.name) ? null : false
    },

    disabled () {
      return this.value.fieldID !== '0' && this.hasRecords
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
