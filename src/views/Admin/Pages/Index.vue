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
          <record-pages-list
            @delete="handleDeletePage($event)"
            v-model="recordPages" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import PageTree from '@/components/Admin/Page/Tree'
import RecordPagesList from '@/components/Admin/Page/RecordPagesList'

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
    async handleDeletePage (pageID) {
      await this.$crm.pageDelete({ pageID })
      await this.$_initList()
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
