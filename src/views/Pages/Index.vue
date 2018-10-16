<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Create a new page</h2>
          <form @submit.prevent="handleAddPageFormSubmit">
            <div class="form-group">
              <label for="title">Page title</label>
              <input required type="text" v-model="addPageFormData.title" class="form-control" id="title" placeholder="Page title" />
            </div>
            <button type="submit" class="btn btn-default">Create</button>
            <div v-if="addPageFormSubmitError" style="color:red">
              {{ addPageFormSubmitError }}
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h2>List of pages</h2>
        <div v-if="deletePageError" style="color:red">
          {{ deletePageError }}
        </div>
        <ul class="list-group">
          <li v-for="(page, index) in pages" :key="index" class="list-group-item d-flex justify-content-between">
            <div>{{ page.title }}</div>
            <div class='d-flex align-items-center actions'>
              <router-link :to="'/builder?pageId=' + page.id" class="actions__action">Organize page</router-link>
              <router-link :to="'/crm/pages/' + page.id + '/edit'" class="actions__action">Edit data</router-link>
              <button type="button" class="btn btn-default actions__action" v-on:click="handleDeletePage(page.id)">Delete</button>
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
  name: 'PageList',
  created () {
    this.$store.dispatch('pages/initList')
  },
  computed: {
    ...mapState({
      initListError: state => state.pages.initListError,
      addPageFormSubmitError: state => state.pages.addPageFormSubmitError,
      deletePageError: state => state.pages.deletePageError,
    }),
    addPageFormData: {
      get () {
        return this.$store.state.pages.addPageFormData
      },
      set (newValue) {
        this.$store.commit('pages/setAddPageFormData', newValue)
      },
    },
    pages: {
      get () {
        return this.$store.state.pages.list
      },
    },
  },
  methods: {
    ...mapActions('pages', ['handleAddPageFormSubmit']),
    async handleDeletePage (id) {
      this.idToDelete = id
      this.$refs.myDeleteModalRef.show(id)
    },
    async handleModalConfirmYes () {
      await this.$store.dispatch('pages/deletePage', this.idToDelete)
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
