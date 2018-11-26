<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Create a new module</h2>
          <form @submit.prevent="create">
            <div class="form-group">
              <label for="name">Module name</label>
              <input required type="text" v-model="addModuleFormData.name" class="form-control" id="name" placeholder="Module name" />
            </div>
            <button type="submit" class="btn btn-primary">Create</button>
            <div v-if="addModuleFormSubmitError" style="color:red;">
              {{ addModuleFormSubmitError }}
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h2>List of modules</h2>
        <div v-if="deleteModuleError" style="color:red;">
          {{ deleteModuleError }}
        </div>
        <table class="table table-striped">
          <tbody>
            <tr v-for="(module, index) in list" :key="index">
              <td>
                <router-link :to="{name: 'admin.modules.view', params: { moduleID: module.moduleID }}">{{ module.name }}</router-link>
              </td>
              <td><time :datetime="module.updatedAt" v-if="module.updatedAt">(Updated at : {{ module.updatedAt }})</time></td>
              <td class="text-right actions">
                <router-link :to="{name: 'admin.modules.edit', params: { moduleID: module.moduleID }}" class="actions__action">Edit data</router-link>
                <confirmation-toggle @confirmed="remove(module.moduleID)">Delete</confirmation-toggle>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="listError" style="color:red;">
          {{ listError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'

export default {
  idToDelete: '',
  name: 'ModuleList',
  data () {
    return {
      deleteModuleError: '',
      listError: '',
      addModuleFormSubmitError: '',
      list: [],
      addModuleFormData: {
        name: '',
        fields: [],
      },
    }
  },
  async created () {
    this.$_initList()
  },
  methods: {
    async $_initList () {
      try {
        this.listError = ''
        this.list = await this.$crm.moduleList({})
      } catch (e) {
        this.listError = 'Error when trying to get list of modules.'
      }
    },

    async create () {
      this.addModuleFormSubmitError = ''
      try {
        this.$crm.moduleCreate(this.addModuleFormData).then((module) => {
          this.$router.push({ name: 'admin.modules.edit', params: { moduleID: module.moduleID } })
        })
        await this.$_initList()
      } catch (e) {
        this.addModuleFormSubmitError = 'Error when trying to create module.'
      }
    },

    async remove (moduleID) {
      await this.$crm.moduleDelete({ moduleID })
      await this.$_initList()
    },
  },

  components: {
    ConfirmationToggle,
  },
}
</script>

<style lang="scss" scoped>
.actions__action {
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 3px;
}
</style>
