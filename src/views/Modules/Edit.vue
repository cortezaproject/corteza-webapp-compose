<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Edit module</h2>
          <div v-if="editModuleError" style="color:red">
            {{ editModuleError }}
          </div>
          <form v-if="!editModuleError" @submit.prevent="handleEditModuleFormSubmit">
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
                    <th>Kind</th>
                    <th>GDPR</th>
                    <th>Show in list</th>
                    <th></th>
                  </tr>
                </thead>
                <draggable v-model="editModuleFormData.fields" :options="{handle:'.handle'}" :element="'tbody'">
                  <tr v-for="field in editModuleFormData.fields" :key="field.id">
                    <td class="handle">[{{field.id}}]</td>
                    <td><input v-model="field.name" type="text" /></td>
                    <td><input v-model="field.title" type="text" /></td>
                    <td><select v-model="field.kind">
                        <option v-for="fieldType in fieldsList" :key="fieldType.type" :value="fieldType.type">{{ _(fieldType.name) }}</option>
                      </select></td>
                    <td>
                      <input v-model="field.gdpr" type="checkbox"> Sensitive data
                    </td>
                    <td>
                      <input v-model="field.show" type="checkbox"> Show
                    </td>
                    <td>
                      <button @click="handleEditModuleRemoveField(field)" type="button" class="btn btn-default">Delete</button>
                    </td>
                  </tr>
                </draggable>
              </table>
            </div>
            <button @click="handleEditModuleAddNewField()" type="button" class="btn btn-default">Add new field</button>
            <div class="row">
              <button type="submit" class="btn btn-primary">Save</button>
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
import { mapState } from 'vuex'
export default {
  name: 'ModuleEdit',
  components: {
    draggable,
  },
  data () {
    return {
      editModuleError: '',
      editModuleFormSubmitError: '',

    }
  },
  async created () {
    try {
      this.editModuleError = ''
      await Promise.all([
        this.$store.dispatch('modules/initEditModuleFormData', this.$route.params.id),
        this.$store.dispatch('fields/initList'),
      ])
    } catch (e) {
      this.editModuleError = 'Error when trying to init module form.'
    }
  },
  computed: {
    ...mapState('fields', {
      fieldsList: 'list',
    }),
    editModuleFormData: {
      get () {
        return this.$store.state.modules.editModuleFormData
      },
      set (newValue) {
        this.$store.commit('modules/setEditModuleFormData', newValue)
      },
    },
  },
  methods: {
    async handleEditModuleFormSubmit () {
      try {
        this.editModuleFormSubmitError = ''
        await this.$store.dispatch('modules/handleEditModuleFormSubmit')
        this.$router.push({ path: '/crm/modules' })
      } catch (e) {
        this.editModuleFormSubmitError = 'Error when trying to edit module.'
      }
    },
    async handleEditModuleAddNewField () {
      await this.$store.dispatch('modules/handleEditModuleAddNewField')
    },
    async handleEditModuleRemoveField (field) {
      await this.$store.dispatch('modules/handleEditModuleRemoveField', field)
    },
  },
}
</script>
<style lang="scss" scoped>
@import "~bootstrap/scss/bootstrap";
.container /deep/ {
  // Bootstrap Modal doesnt work if we comment this line
  @import "~bootstrap/scss/bootstrap";
}
button[type="submit"] {
  margin-top: 10px;
}
</style>
