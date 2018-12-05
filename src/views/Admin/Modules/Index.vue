<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>List of modules</h2>
          <table class="table">
            <tbody>
              <tr v-for="(module, index) in list" :key="index">
                <td>
                  <router-link :to="{name: 'admin.modules.content', params: { moduleID: module.moduleID }}">{{ module.name }}</router-link>
                </td>
                <td><time :datetime="module.updatedAt" v-if="module.updatedAt">(Updated at : {{ module.updatedAt }})</time></td>
                <td class="actions">
                  <router-link :to="{name: 'admin.modules.edit', params: { moduleID: module.moduleID }}" class="action">
                    <i class="action icon-edit"></i>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="listError" style="color:red;">
            {{ listError }}
          </div>
          <form @submit.prevent="create">
            <div class="form-group form-inline">
            <label for="name">Create a new module:</label>
              <input required type="text" v-model="addModuleFormData.name" class="form-control" id="name" placeholder="Module name" />
              <button type="submit" class="btn btn-dark">Create</button>
            </div>
            <div v-if="addModuleFormSubmitError" style="color:red;">
              {{ addModuleFormSubmitError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Field from '@/lib/field'

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
        this.addModuleFormData.fields = [
          new Field({ name: 'sample', kind: 'text' }),
        ]

        this.$crm.moduleCreate(this.addModuleFormData).then((module) => {
          this.$router.push({ name: 'admin.modules.edit', params: { moduleID: module.moduleID } })
        })
        await this.$_initList()
      } catch (e) {
        this.addModuleFormSubmitError = 'Error when trying to create module.'
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.actions {
  text-align: right;
}

label{
  margin: 10px 0 5px;
}
.form-inline {
  .form-control{
    margin-right: 10px;
    width: calc(100% - 72px);
  }
}
.form-group{
  margin-bottom: 0;
}
</style>
