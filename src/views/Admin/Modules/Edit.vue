<template>
  <div>

    <form @submit.prevent="handleUpdate" class="container">
      <div class="row">
        <div class="col-md-12 well">
        <h2>Edit module</h2>
          <div v-if="error" style="color:red;">
            {{ error }}
          </div>
          <input required type="hidden" v-model="module.moduleID" />
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
                <th v-b-tooltip.hover title="Privacy sensitive data" class="info">Sensitive</th>
                <th v-b-tooltip.hover title="Use this column in admin data list" class="info">Visible</th>
                <th class="text-center"></th>
              </tr>
              </thead>
              <draggable v-model="module.fields" :options="{handle:'.handle'}" element="tbody">
                <tr v-for="(field, index) in module.fields" v-if="field" :key="index">
                  <td v-b-tooltip.hover title="Drag and drop to change order" class="handle"><font-awesome-icon :icon="['fas', 'sort']" title="Reorder fields"></font-awesome-icon></td>
                  <td><input v-model="field.name" type="text" class="form-control" /></td>
                  <td><input v-model="field.label" type="text" class="form-control" /></td>
                  <td class="type">
                    <select v-model="field.kind" class="form-control" @change="handleKindChange(field)">
                      <option v-for="fieldType in fieldsList" :key="fieldType.kind" :value="fieldType.kind">{{ fieldType.label||fieldType.kind }}</option>
                    </select>
                    <a
                      :disabled="!field.isConfigurable()"
                      @click.prevent="handleFieldEdit(field)"
                      class="btn-url"><font-awesome-icon :icon="['fas', 'wrench']"></font-awesome-icon></a>
                  </td>
                  <td class="text-center">
                    <input v-model="field.isRequired" type="checkbox"/>
                  </td>
                  <td class="text-center">
                    <input v-model="field.isPrivate" type="checkbox"/>
                  </td>
                  <td class="text-center">
                    <input v-model="field.isVisible" type="checkbox"/>
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
          <button type="submit" class="btn btn-dark">Save</button>
          <button type="button" @click.prevent="handleUpdate({ closeOnSuccess: true })" class="btn btn-dark">Save and close</button>
          <button @click="redirect()" type="button" class="btn">Cancel</button>
          <confirmation-toggle @confirmed="handleDelete" class="confirmation">Delete module</confirmation-toggle>
        </div>
      </div>
    </form>

    <b-modal
      v-if="updateField"
      title="Module field settings"
      ok-title="Close"
      @ok="handleFieldSave(updateField)"
      @hide="updateField=null"
      :visible="!!updateField">
      <field-configurator :field.sync="updateField" />
    </b-modal>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import FieldConfigurator from '@/lib/field/Configurator'
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import Field from '@/lib/field'
import fieldList from '@/lib/field/list'

export default {
  props: {
    moduleID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      error: '',
      module: {},
      updateField: null,
      fieldsList: fieldList,
    }
  },

  mounted () {
    this.$crm.moduleRead({ moduleID: this.moduleID }).then(rsp => {
      if (!Array.isArray(rsp.fields)) {
        // In some cases, empty arrays are unmarshal as an empty object
        // and draggable component complains
        rsp.fields = []
      } else {
        rsp.fields = rsp.fields.map(f => new Field(f))
      }

      this.module = rsp
    }).catch(() => {
      this.error = 'Error when trying to init module form.'
    })
  },

  methods: {
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
      console.debug('Updating field options', field, i)
      if (i > -1) {
        this.module.fields.splice(i, 1, field)
      }
    },

    handleUpdate ({ closeOnSuccess = false } = {}) {
      this.$crm.moduleEdit(this.module).then(() => {
        if (closeOnSuccess) {
          this.redirect()
        }
      }).catch(() => {
        this.error = 'Error when trying to edit module.'
      })
    },

    handleDelete () {
      this.$crm.moduleDelete({ moduleID: this.moduleID }).then(() => {
        this.$router.push({ name: 'admin.modules' })
      })
    },

    redirect () {
      this.$router.push({ name: 'admin.modules' })
    },
  },

  components: {
    ConfirmationToggle,
    draggable,
    FieldConfigurator,
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
        font-family: "Font Awesome 5 Free";
        content: "\f059";
        padding-left: 3px;
        font-weight: 300;
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
        color: silver;
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

.confirmation {
  float: right;
}

h5 {
  margin-top: 40px;
}
</style>
