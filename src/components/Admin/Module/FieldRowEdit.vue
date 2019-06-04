<template>
  <tr>
    <td v-b-tooltip.hover
        :title="$t('module.edit.tooltip.dragAndDrop')"
        class="handle text-center">
        <font-awesome-icon :icon="['fas', 'sort']"
                           class="text-secondary"
                           :title="$t('module.edit.reorderFields')"></font-awesome-icon>
    </td>
    <td>
      <b-form-input v-model="field.name"
                    required
                    :readonly="disabled"
                    :state="checkFieldName"
                    type="text"
                    class="form-control"></b-form-input>
    </td>
    <td>
      <input v-model="field.label"
             type="text"
             class="form-control"/>
    </td>
    <td class="type">
      <select v-model="field.kind"
              :disabled="disabled"
              class="form-control"
              @change="handleKindChange(field)">
        <option v-for="fieldType in fieldsList"
                :key="fieldType.kind"
                :value="fieldType.kind">{{ fieldType.label||fieldType.kind }}</option>
      </select>
      <b-button :disabled="!field.isConfigurable()"
              @click.prevent="$emit('edit')"
              class="pl-1 pr-0 text-secondary"
              variant="link">
        <font-awesome-icon :icon="['fas', 'wrench']"></font-awesome-icon></b-button>
    </td>
    <td class="text-center">
      <b-form-checkbox plain
                       v-model="field.isRequired"
                       :value="true"
                       class="pl-0"
                       :unchecked-value="false"></b-form-checkbox>
    </td>
    <td class="text-center">
      <b-form-checkbox plain
                       v-model="field.isPrivate"
                       :value="true"
                       :unchecked-value="false"></b-form-checkbox>
    </td>
    <td class="text-right">
      <confirmation-toggle @confirmed="$emit('delete')"
                           :no-prompt="!field.name"
                           class="confirmation-small">
        <i class="action icon-trash"></i>
      </confirmation-toggle>
      <permissions-button v-if="canGrant" :title="field.name" :resource="'compose:module-field:'+field.fieldID" link />
    </td>
  </tr>
</template>

<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import fieldList from '@/lib/field/list'

export default {
  components: {
    ConfirmationToggle,
  },

  props: {
    field: {
      type: Object,
      required: true,
    },

    canGrant: {
      type: Boolean,
      required: false,
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
      return this.field.name.length > 1 && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(this.field.name) ? null : false
    },

    disabled () {
      // @todo count number of records and disable if > 0
      return false
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

.handle {
  cursor: grab;
}

/deep/ .confirmation-small {
  .btn {
    padding: 0 10px;
  }

  .btn-outline-danger {
    border: none;
  }

  .btn-danger,
  .btn-secondary {
    font-size: 12px;
  }
}

td {
  &.type {
    width: 200px;

    select {
      width: 160px;
      display: inline-block;
    }

    button:disabled {
      color: $secondary;
      cursor: auto;
    }
  }
}
</style>
