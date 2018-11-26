<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h2>Create a new page</h2>
        <div class="well">
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
    <div v-if="listError" style="color:red;">
      {{ listError }}
    </div>
    <div class="row">
      <div class="col-md-12">
        <h2>List of pages</h2>
        <div class="well">
          <div v-if="deletePageError" style="color:red;">
            {{ deletePageError }}
          </div>

          <page-tree
            @delete="handleDeletePage($event)"
            @reorder="handleReorder"
            v-model="tree"/>
        </div>
      </div>
    </div>
    <div class="row ">
      <div class="col-md-12">
        <h2>List of record pages</h2>
        <div class="well">
          <record-pages-list v-model="recordPages" />
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
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import PageTree from '@/components/Page/Tree'
import RecordPagesList from '@/components/Page/RecordPagesList'

export default {
  idToDelete: '',
  name: 'PageList',
  data () {
    return {
      deletePageError: '',
      listError: '',
      addPageFormSubmitError: '',
      tree: [],
      recordPages: [],
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
        this.$crm.pageTree({}).then((tree) => {
          this.recordPages = []
          const traverse = (pages) => {
            return pages.map((p) => {
              if (p.moduleID !== '0') {
                this.recordPages.push(p)
              }

              if (p.children) {
                p.children = traverse(p.children).filter((p) => p.moduleID === '0')
              }

              return p
            })
          }

          this.tree = traverse(tree)
        })
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
    RecordPagesList,
  },
}
</script>
