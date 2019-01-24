<template>
  <tr>
    <td v-b-tooltip.hover title="Drag and drop to change order" class="handle"><font-awesome-icon :icon="['fas', 'sort']" title="Reorder fields"></font-awesome-icon></td>
    <td><b-form-input v-model="field.name"
                      required
                      :state="checkFieldName"
                      type="text"
                      class="form-control"></b-form-input></td>
    <td><input v-model="field.label" type="text" class="form-control" /></td>
    <td class="type">
      <select v-model="field.kind" class="form-control" @change="handleKindChange(field)">
        <option v-for="fieldType in fieldsList" :key="fieldType.kind" :value="fieldType.kind">{{ fieldType.label||fieldType.kind }}</option>
      </select>
      <button
        :disabled="!field.isConfigurable()"
        @click.prevent="handleFieldEdit(field)"
        class="btn-url"><font-awesome-icon :icon="['fas', 'wrench']"></font-awesome-icon></button>
    </td>
    <td class="text-center">
      <input v-model="field.isRequired" type="checkbox"/>
    </td>
    <td class="text-center">
      <input v-model="field.isPrivate" type="checkbox"/>
    </td>
    <td class="text-center">
      <confirmation-toggle @confirmed="module.fields.splice(index, 1)" class="confirmation-small" cta-class="btn-url">
        <i class="action icon-trash"></i>
      </confirmation-toggle>
    </td>
  </tr>
</template>

<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import fieldList from '@/lib/field/list'

export default {
  props: {
    field: {
      type: Object,
      required: true,
    },
  },

  computed: {
    checkFieldName () {
      return this.field.name.length > 1 && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(this.field.name) ? null : false
    },
  },

  data () {
    return {
      updateField: null,
      module: null,
      fieldsList: fieldList,
    }
  },

  components: {
    ConfirmationToggle,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

tr {
  padding: 3px;
  vertical-align: middle;

  .handle {
    width: 30px;
    color: $appgrey;
    text-align: center;
    cursor: grab;
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
      color: $appgrey;
      cursor: auto;
    }
  }

  .btn-url {
    margin-left: 10px;

    &.add-new {
      display: block;
      margin: -10px 35px 20px;
    }
  }
}
</style>
