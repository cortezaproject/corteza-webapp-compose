<template>
  <div>
    <editor-toolbar :back-link="{name: 'admin.modules'}"
                    @delete="handleDelete"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
    <form @submit.prevent="handleSave" class="container" v-if="module">
      <div class="row">
        <div class="col-md-12 well">
        <h2>Edit module</h2>
          <div class="form-group">
            <label>Module name</label>
            <input required type="text" v-model="module.name" class="form-control" placeholder="Module name" />
          </div>
          <div class="form-group">
            <h5>Manage record fields</h5>
            <table class="table">
              <thead>
              <tr>
                <th></th>
                <th v-b-tooltip.hover.topright title="Must be lower-case a-z, 0-9 and underscore" class="info">Name</th>
                <th v-b-tooltip.hover.topright title="The name displayed in form input / data lists" class="info">Title</th>
                <th>Type</th>
                <th v-b-tooltip.hover title="Required field" class="info">Required</th>
                <th v-b-tooltip.hover title="Sensitive data" class="info">Sensitive</th>
                <th class="text-center"></th>
              </tr>
              </thead>
              <draggable v-model="module.fields" :options="{handle:'.handle'}" element="tbody">
                <tr v-for="(field, index) in module.fields" v-if="field" :key="index">
                  <td v-b-tooltip.hover title="Drag and drop to change order" class="handle"><font-awesome-icon :icon="['fas', 'sort']" title="Reorder fields"></font-awesome-icon></td>
                  <td><b-form-input v-model="field.name"
                                    required
                                    :state="checkFieldNameState(field)"
                                    type="text"
                                    class="form-control" /></td>
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
              </draggable>
            </table>
          </div>
          <button @click="handleNewField" type="button" class="btn-url add-new">+ Add new field</button>
        </div>
      </div>
    </form>

    <b-modal
      v-if="updateField"
      title="Module field settings"
      ok-title="Save and close"
      ok-variant="dark"
      ok-only
      @ok="handleFieldSave(updateField)"
      @hide="updateField=null"
      :visible="!!updateField">
      <field-configurator :field.sync="updateField" />
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import draggable from 'vuedraggable'
import FieldConfigurator from '@/lib/field/Configurator'
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import Field from '@/lib/field'
import Module from '@/lib/module'
import fieldList from '@/lib/field/list'
import EditorToolbar from '@/components/Admin/EditorToolbar'

const fieldNameCheck = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$')

export default {
  props: {
    moduleID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      updateField: null,
      module: null,
      fieldsList: fieldList,
    }
  },

  created () {
    this.findModuleByID({ moduleID: this.moduleID }).then((module) => {
      // Make a copy so that we do not change store item by ref
      this.module = new Module({ ...module })
    })
  },

  methods: {
    ...mapActions({
      findModuleByID: 'module/findByID',
      updateModule: 'module/update',
      deleteModule: 'module/delete',
    }),

    checkFieldNameState (field) {
      return field.name.length > 1 && fieldNameCheck.test(field.name) ? null : false
    },

    handleNewField () {
      this.module.fields.push(new Field())
    },

    handleKindChange (field) {
      field.merge({ kind: field.kind })
    },

    handleFieldEdit (field) {
      this.updateField = new Field(field)
    },

    handleFieldSave (field) {
      const i = this.module.fields.findIndex(f => f.name === field.name)
      if (i > -1) {
        this.module.fields.splice(i, 1, field)
      }
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      this.updateModule(this.module).then(() => {
        this.raiseSuccessAlert('Module saved')
        if (closeOnSuccess) {
          this.redirect()
        }
      }).catch(this.defaultErrorHandler('Could not save this module'))
    },

    handleDelete () {
      this.deleteModule({ moduleID: this.moduleID }).then(() => {
        this.raiseSuccessAlert('Module deleted')
        this.$router.push({ name: 'admin.modules' })
      }).catch(this.defaultErrorHandler('Could not delete this module'))
    },

    redirect () {
      this.$router.push({ name: 'admin.modules' })
    },
  },

  components: {
    ConfirmationToggle,
    draggable,
    FieldConfigurator,
    EditorToolbar,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

/* stylelint-disable font-family-no-missing-generic-family-keyword */

table {
  th, td, tr {
    padding: 3px;
    vertical-align: middle;
  }

  tr {
    .handle {
      width: 30px;
      color: $appgrey;
      text-align: center;
      cursor: grab;
    }
  }

  th {
    cursor: default;

    &.info {
      min-width: 50px;

      &::after {
        font-family: $icomoon-font-family;
        content: "\ea0c";
        padding-left: 3px;
        font-weight: 300;
        color: $appgrey;
      }
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
  }
}

.btn-url {
  margin-left: 10px;

  &.add-new {
    display: block;
    margin: -10px 35px 20px;
  }
}

h5 {
  margin-top: 40px;
}
</style>
