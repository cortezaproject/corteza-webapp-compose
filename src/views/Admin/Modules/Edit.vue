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
            <h3>Manage record fields</h3>
            <table class="table">
              <thead>
              <tr>
                <th></th>
                <th v-b-tooltip.hover title="Must be lower-case a-z, 0-9 and underscore">Name</th>
                <th v-b-tooltip.hover title="The name displayed in form input / data lists">Title</th>
                <th>Type</th>
                <th class="text-center" title="Input is required" style="width: 50px;">Req.</th>
                <th class="text-center" title="Privacy sensitive data" style="width: 50px;">Prv.</th>
                <th class="text-center" title="Use this column in admin data list" style="width: 50px;">Show in list</th>
                <th class="text-center"></th>
              </tr>
              </thead>
              <draggable v-model="module.fields" :options="{handle:'.handle'}" element="tbody">
                <tr v-for="(field, index) in module.fields" v-if="field" :key="index">
                  <td class="handle"><font-awesome-icon :icon="['fas', 'sort']" title="Reorder fields"></font-awesome-icon></td>
                  <td><input v-model="field.name" type="text" class="form-control" /></td>
                  <td><input v-model="field.label" type="text" class="form-control" /></td>
                  <td class="type">
                    <select v-model="field.kind" class="form-control">
                      <option v-for="fieldType in fieldsList" :key="fieldType.kind" :value="fieldType.kind">{{ fieldType.label||fieldType.kind }}</option>
                    </select>
                    <button
                      :disabled="!field.isConfigurable()"
                      type="button"
                      @click.prevent="handleFieldEdit(field)"
                      class="btn"><font-awesome-icon :icon="['fas', 'wrench']"></font-awesome-icon></button>
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
                    <confirmation-toggle @confirmed="module.fields.splice(index, 1)" class="confirmation">Delete</confirmation-toggle>
                  </td>
                </tr>
              </draggable>
            </table>
          </div>
          <button @click="handleNewField" type="button" class="btn btn-secondary">Add new field</button>
          <button @click="redirect()" type="button" class="btn">Cancel</button>
          <confirmation-toggle @confirmed="handleDelete" class="confirmation">Delete module</confirmation-toggle>
          <button type="submit" class="btn btn-primary">Save</button>&nbsp;
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

    handleFieldEdit (field) {
      this.updateField = new Field(field)
      this.updateField.name = this.updateField.name + '!!!'
    },

    handleFieldSave (field) {
      const i = this.module.fields.findIndex(f => f.name === field.name)
      if (i > -1) {
        this.fields.splice(i, 1, field)
      }
    },

    handleUpdate () {
      this.$crm.moduleEdit(this.module).then(() => {
        this.redirect()
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
table {
  th, td, tr {
    padding: 3px;
  }

  tr {
    .handle {
      width: 30px;
      text-align: center;
      vertical-align: middle;
    }
  }

  td.type {
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
</style>
