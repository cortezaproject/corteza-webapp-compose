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
            <button type="submit" class="btn btn-primary">Create</button>
            <div v-if="addPageFormSubmitError" style="color:red;">
              {{ addPageFormSubmitError }}
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h2>List of pages</h2>
        <div v-if="deletePageError" style="color:red;">
          {{ deletePageError }}
        </div>

        <page-tree
          @delete="handleDeletePage($event)"
          @reorder="handleReorder"
          v-model="list"/>

        <div v-if="listError" style="color:red;">
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
import draggable from 'vuedraggable'
import PageTree from '@/components/Page/Tree'

export default {
  idToDelete: '',
  name: 'PageList',
  data () {
    return {
      deletePageError: '',
      listError: '',
      addPageFormSubmitError: '',
      list: [],
      addPageFormData: {
        title: '',
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
        this.list = await this.$crm.pageTree({})
      } catch (e) {
        this.listError = 'Error when trying to get list of pages.'
      }
    },
    async handleAddPageFormSubmit () {
      this.addPageFormSubmitError = ''
      try {
        await this.$crm.pageCreate(this.addPageFormData)
        await this.$_initList()
      } catch (e) {
        this.addPageFormSubmitError = 'Error when trying to create page.'
      }
    },
    async handleDeletePage (id) {
      this.idToDelete = id
      this.$refs.myDeleteModalRef.show(id)
    },
    async handleModalConfirmYes () {
      try {
        await this.$crm.pageDelete({ id: this.idToDelete })
        await this.$_initList()
      } catch (e) {
        this.deletePageError = 'Error when trying to delete page.'
      }
      this.$refs.myDeleteModalRef.hide()
    },
    handleModalConfirmNo () {
      this.$refs.myDeleteModalRef.hide()
    },

    handleReorder () {
      this.$_initList()
    },
  },

  components: {
    draggable,
    PageTree,
  },
}
</script>
<style scoped lang="scss">
table {
  width: 100%;
}
</style>
