<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Create a new module</h2>
          <form @submit.prevent="handleAddModuleFormSubmit">
            <div class="form-group">
              <label for="moduleitem">Module name</label>
              <input required type="text" v-model="addModuleFormData.name" class="form-control" id="name" placeholder="Module name" />
            </div>
            <button type="submit" class="btn btn-default">Create</button>
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
          <li v-for="(moduleElmt, index) in modules" :key="index" class="list-group-item d-flex justify-content-between">
            <div>{{ moduleElmt.name }}</div>
            <div class='d-flex align-items-center actions'>
              <router-link :to="'/builder?moduleElmtId=' + moduleElmt.id" class="actions__action">Organize moduleElmt</router-link>
              <router-link :to="'/crm/modules/' + moduleElmt.id + '/edit'" class="actions__action">Edit data</router-link>
              <button type="button" class="btn btn-default actions__action" v-on:click="handleDeleteModule(module.id)">Delete</button>
            </div>
          </li>
        </ul>
        <div v-if="initListError" style="color:red">
          {{ initListError }}
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
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { mapState, mapActions } from 'vuex'
export default {
  idToDelete: '',
  name: 'Module',
  created () {
    this.$store.dispatch('modules/initList')
  },
  computed: {
    ...mapState({
      initListError: state => state.modules.initListError,
      addModuleFormSubmitError: state => state.modules.addModuleFormSubmitError,
      deleteModuleError: state => state.modules.deleteModuleError,
    }),
    addModuleFormData: {
      get () {
        return this.$store.state.modules.addModuleFormData
      },
      set (newValue) {
        this.$store.commit('modules/setAddModuleFormData', newValue)
      },
    },
    modules: {
      get () {
        return this.$store.state.modules.list
      },
    },
  },
  methods: {
    ...mapActions('modules', ['handleAddModuleFormSubmit']),
    async handleDeleteModule (id) {
      this.idToDelete = id
      this.$refs.myDeleteModalRef.show(id)
    },
    async handleModalConfirmYes () {
      await this.$store.dispatch('modules/deleteModule', this.idToDelete)
      this.$refs.myDeleteModalRef.hide()
    },
    handleModalConfirmNo () {
      this.$refs.myDeleteModalRef.hide()
    },
  },
}
</script>
<style lang="scss">
.actions__action {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
