<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Edit module</h2>
          <div v-if="editModuleError" style="color:red">
            {{ editModuleError }}
          </div>
          <form v-if="!editModuleError" @submit.prevent="FormSubmit">
            <input required type="hidden" v-model="editModuleFormData.id" id="id" />
            <div class="form-group">
              <label for="name">Module name</label>
              <input required type="text" v-model="editModuleFormData.name" class="form-control" id="name" placeholder="Module name" />
            </div>
            <div class="form-group">
              <label for="name">Module fields</label>
              <table class="table" border="1">
                <thead>
                  <tr>
                    <th>#</th>
                    <th v-b-tooltip.hover title="Must be lower-case a-z, 0-9 and underscore">Name</th>
                    <th v-b-tooltip.hover title="The name displayed in form input / data lists">Title</th>
                    <th>Type</th>
                    <th>Privacy sensitive data</th>
                    <th>Show in list</th>
                    <th></th>
                  </tr>
                </thead>
                <draggable v-model="editModuleFormData.fields" :options="{handle:'.handle'}" :element="'tbody'">
                  <tr v-for="field in editModuleFormData.fields" :key="field.id">
                    <td class="handle text-nowrap">[{{field.id}}]</td>
                    <td><input v-model="field.name" type="text" class="form-control" /></td>
                    <td><input v-model="field.title" type="text" class="form-control" /></td>
                    <td><select v-model="field.kind" class="form-control">
                    <option v-for="fieldType in fieldsList" :key="fieldType.type" :value="fieldType.type">{{ _(fieldType.name) }}</option>
                    </select></td>
                    <td>
                      <input v-model="field.gdpr" type="checkbox"> Sensitive data
                    </td>
                    <td>
                      <input v-model="field.show" type="checkbox"> Show
                    </td>
                    <td>
                      <button @click="RemoveField(field)" type="button" class="btn btn-default">Delete</button>
                    </td>
                  </tr>
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
            <div v-if="editModuleFormSubmitError" style="color:red">
              {{ editModuleFormSubmitError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'ModuleEdit',
  components: {
    draggable,
  },
  data () {
    var moduleID = this.$route.params.moduleID
    return {
      moduleID: moduleID,
      editModuleError: '',
      editModuleFormSubmitError: '',
      fieldsList: [],
      editModuleFormData: {
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
      this.editModuleFormData = await this.$crm.moduleRead(req)
    } catch (e) {
      this.editModuleError = 'Error when trying to init module form.'
    }
  },
  computed: {
  },
  methods: {
    redirect () {
      this.$router.push({
        path: '/crm/modules',
      })
    },
    async $_initFieldsList () {
      try {
        this.editModuleError = ''
        this.fieldsList = await this.$crm.fieldList({})
      } catch (e) {
        this.editModuleError = 'Error when trying to get list of fields.'
      }
    },
    /**
     * Get new unique id from fields.
     * @param {{id}[]} fields
     * @param {String|null|undefined} potentialId
     */
    $_getNewIDForField (fields, potentialId) {
      if (potentialId == null) {
        return this.$_getNewIDForField(fields, 1)
      }
      let founded = false
      fields.forEach((value) => {
        if (value.id === potentialId) {
          founded = true
        }
      })
      if (founded) {
        return this.$_getNewIDForField(fields, ++potentialId)
      }
      return potentialId
    },
    async FormSubmit () {
      try {
        this.editModuleFormSubmitError = ''
        await this.$crm.moduleEdit(this.editModuleFormData)
        this.redirect()
      } catch (e) {
        this.editModuleFormSubmitError = 'Error when trying to edit module.'
      }
    },
    AddNewField () {
      this.editModuleFormData.fields.push({
        id: this.$_getNewIDForField(this.editModuleFormData.fields),
        name: '',
        title: '',
        kind: 'text',
        gdpr: false,
      })
    },
    RemoveField (field) {
      const index = this.editModuleFormData.fields.indexOf(field)
      if (index !== -1) {
        this.editModuleFormData.fields.splice(index, 1)
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
