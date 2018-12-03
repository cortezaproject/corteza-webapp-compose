<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Edit module</h2>
          <div v-if="editModuleError" style="color:red;">
            {{ editModuleError }}
          </div>
          <form v-if="!editModuleError" @submit.prevent="save">
            <input required type="hidden" v-model="formData.moduleID" />
            <div class="form-group">
              <label>Module name</label>
              <input required type="text" v-model="formData.name" class="form-control" placeholder="Module name" />
            </div>
            <div class="form-group">
              <label>Manage record fields</label>
              <table class="table" border="1">
                <thead>
                  <tr>
                    <th>#</th>
                    <th v-b-tooltip.hover title="Must be lower-case a-z, 0-9 and underscore">Name</th>
                    <th v-b-tooltip.hover title="The name displayed in form input / data lists">Title</th>
                    <th>Type</th>
                    <th class="text-center">Required</th>
                    <th class="text-center">Privacy sensitive data</th>
                    <th class="text-center">Show in list</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <draggable v-model="formData.fields" :options="{handle:'.handle'}" :element="'tbody'">
                  <template v-for="(field,index) in formData.fields" v-if="field">
                    <tr :key="'modules-edit-' + index">
                      <td class="handle text-nowrap">[{{index}}]</td>
                      <td><input v-model="field.name" type="text" class="form-control" /></td>
                      <td><input v-model="field.title" type="text" class="form-control" /></td>
                      <td><select v-model="field.kind" class="form-control">
                      <option v-for="fieldType in fieldsList" :key="fieldType.type" :value="fieldType.type">{{ _(fieldType.name) }}</option>
                      </select></td>
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
                        <button @click="RemoveField(field)" type="button" class="btn btn-default">Delete</button>
                      </td>
                    </tr>
                    <Field-Settings :field="field" :key="'modules-edit-' + index + '-settings'"></Field-Settings>
                  </template>
                </draggable>
              </table>
            </div>
            <button @click="AddNewField()" type="button" class="btn btn-default">Add new field</button>
            <div class="row">
              <div class="col-12" style="padding-top: 10px;">
                <button type="submit" class="btn btn-primary">Save</button>&nbsp;
                <button @click="redirect()" class="btn btn-secondary">Cancel</button>
              </div>
            </div>
            <div v-if="formSubmitError" style="color:red;">
              {{ formSubmitError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import FieldSettings from '@/components/FieldSettings.vue'

export default {
  name: 'ModuleEdit',
  props: {
    moduleID: String,
  },
  components: {
    draggable,
    FieldSettings,
  },
  data () {
    return {
      mode: this.moduleID ? 'edit' : 'create',
      components: Vue.options.components,
      editModuleError: '',
      formSubmitError: '',
      fieldsList: [],
      formData: {
        name: '',
        fields: [],
      },
    }
  },
  async created () {
    try {
      this.editModuleError = ''
      await this.$_initFieldsList()
      var req = {
        moduleID: this.moduleID,
      }
      this.$crm.moduleRead(req).then(rsp => {
        if (!Array.isArray(rsp.fields)) {
          // In some cases, empty arrays are unarshaled as an empty object
          // and draggable component complains
          rsp.fields = []
        }

        this.formData = rsp
      })

      if (!this.formData.fields) {
        // Making sure
      }

    } catch (e) {
      this.editModuleError = 'Error when trying to init module form.'
    }
  },
  computed: {
  },
  methods: {
    getField (type) {
      for (let i = 0; i < this.fieldsList.length; i++) {
        if (this.fieldsList[i].type === type) {
          return this.fieldsList[i].componentOptions
        }
      }
      return ''
    },
    redirect () {
      this.$router.push({ name: 'admin.modules' })
    },
    async $_initFieldsList () {
      var capitalize = (s) => {
        var ucfirst = (s) => {
          return s.charAt(0).toUpperCase() + s.substring(1)
        }
        return s.split('_').map(ucfirst).join('')
      }
      try {
        this.editModuleError = ''
        this.fieldsList = await this.$crm.fieldList({})
        this.fieldsList.forEach((field) => {
          field.componentOptions = 'ModuleField' + capitalize(field.type)
        })
      } catch (e) {
        this.$logger.error(e)
        this.editModuleError = 'Error when trying to get list of fields.'
      }
    },


    async save () {
      try {
        if (this.mode === 'create') {
          await this.$crm.moduleCreate(this.formData)
        } else {
          this.formSubmitError = ''
          await this.$crm.moduleEdit(this.formData)
          this.redirect()
        }
      } catch (e) {
        this.formSubmitError = 'Error when trying to edit module.'
      }
    },
    AddNewField () {
      this.formData.fields.push({
        name: '',
        title: '',
        kind: 'text',
        isPrivate: false,
        isRequired: true,
        isHidden: false,
      })
    },
    RemoveField (field) {
      const index = this.formData.fields.indexOf(field)
      if (index !== -1) {
        this.formData.fields.splice(index, 1)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.table th,
.table td,
.table tr {
  padding: 3px;
}
</style>
