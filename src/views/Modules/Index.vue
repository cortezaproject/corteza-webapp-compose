<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Create a new module</h2>
          <form @submit.prevent="handleAddModuleFormSubmit">
            <div class="form-group">
              <label for="name">Module name</label>
              <input required type="text" v-model="addModuleFormData.name" class="form-control" id="name" placeholder="Module name" />
            </div>
            <button type="submit" class="btn btn-primary">Create</button>
            <div v-if="addModuleFormSubmitError" style="color:red">
              {{ addModuleFormSubmitError }}
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h2>List of modules</h2>
        <div v-if="deleteModuleError" style="color:red">
          {{ deleteModuleError }}
        </div>
        <ul class="list-group">
          <li v-for="(module, index) in list" :key="index" class="list-group-item d-flex justify-content-between">
            <div>{{ module.name }}</div>
            <div>(Updated at : {{ module.updatedAt }})</div>
            <div class='d-flex align-items-center actions'>
              <router-link :to="'/crm/modules/' + module.id + '/edit'" class="actions__action">Edit data</router-link>
              <button type="button" class="btn btn-default actions__action" v-on:click="handleDeleteModule(module.id)">Delete</button>
            </div>
          </li>
        </ul>
        <div v-if="listError" style="color:red">
          {{ listError }}
        </div>
      </div>
    </div>
    <b-modal ref="myDeleteModalRef" hide-footer title="Confirmation">
      <div class="d-block text-center">
        <h3>Do you confirm deletion ?</h3>
      </div>
      <b-btn class="mt-3" variant="outline-info" block @click="handleModalConfirmYes()">Yes</b-btn>
      <b-btn class="mt-3" variant="outline-danger" block @click="handleModalConfirmNo()">No</b-btn>
    </b-modal>
  </div>
</template>

<script>

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
    async handleAddModuleFormSubmit () {
      this.addModuleFormSubmitError = ''
      try {
        await this.$crm.moduleCreate(this.addModuleFormData)
        await this.$_initList()
      } catch (e) {
        this.addModuleFormSubmitError = 'Error when trying to create module.'
      }
    },
    async handleDeleteModule (id) {
      this.idToDelete = id
      this.$refs.myDeleteModalRef.show(id)
    },
    async handleModalConfirmYes () {
      try {
        await this.$crm.moduleDelete({ id: this.idToDelete })
        await this.$_initList()
      } catch (e) {
        this.deleteModuleError = 'Error when trying to delete module.'
      }
      this.$refs.myDeleteModalRef.hide()
    },
    handleModalConfirmNo () {
      this.$refs.myDeleteModalRef.hide()
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
.actions__action {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
