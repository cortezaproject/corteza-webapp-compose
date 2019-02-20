<template>
  <div>
    <div class="h-100">
    <form @submit.prevent="handleSave" class="container scrollable" v-if="module">
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
                <th v-b-tooltip.hover.topright title="Must be a-z/A-Z, 0-9 or underscore" class="info">Name</th>
                <th v-b-tooltip.hover.topright title="The name displayed in form input / data lists" class="info">Title</th>
                <th>Type</th>
                <th v-b-tooltip.hover title="Required field" class="info">Required</th>
                <th v-b-tooltip.hover title="Sensitive data" class="info">Sensitive</th>
                <th class="text-center"></th>
              </tr>
              </thead>
              <draggable v-model="module.fields" :options="{handle:'.handle'}" element="tbody">
                <field-row-edit v-for="(field, index) in module.fields"
                                @edit="handleFieldEdit(field)"
                                @delete="module.fields.splice(index, 1)"
                                :field="field"
                                :key="index"></field-row-edit>
              </draggable>
              <tr>
                <th colspan="7">
                  <button @click="handleNewField" type="button" class="btn-url add-new">+ Add new field</button>
                </th>
              </tr>
              <tbody>
                <tr>
                  <th colspan="7">System fields:</th>
                </tr>
                <field-row-view v-for="(field, index) in module.systemFields()"
                                :field="field"
                                :key="index"></field-row-view>
              </tbody>
            </table>
          </div>
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
    <editor-toolbar :back-link="{name: 'admin.modules'}"
                    @delete="handleDelete"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import draggable from 'vuedraggable'
import FieldConfigurator from '@/lib/field/Configurator'
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import FieldRowEdit from '@/components/Admin/Module/FieldRowEdit'
import FieldRowView from '@/components/Admin/Module/FieldRowView'
import Field from '@/lib/field'
import Module from '@/lib/module'
import EditorToolbar from '@/components/Admin/EditorToolbar'

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

    handleNewField () {
      this.module.fields.push(new Field())
    },

    handleFieldEdit (field) {
      this.updateField = new Field({ ...field })
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
    FieldRowEdit,
    FieldRowView,
    EditorToolbar,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

/* stylelint-disable font-family-no-missing-generic-family-keyword */

table {
  th, td {
    padding: 3px;
    vertical-align: middle;
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
}

.btn-url {
  margin-left: 10px;

  &.add-new {
    display: block;
    margin: 10px 35px 20px;
  }
}

h5 {
  margin-top: 40px;
}
</style>
