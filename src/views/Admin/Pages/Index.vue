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
            <button type="submit" class="btn btn-dark">Create</button>
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
        <div class="well">
        <h2>List of pages</h2>
          <page-tree
            @reorder="handleReorder"
            v-model="tree"/>
        </div>
      </div>
    </div>
    <div class="row ">
      <div class="col-md-12">
        <div class="well">
        <h2>List of record pages</h2>
          <record-pages-list
            @createRecordPage="handleRecordPageCreation($event)"
            :modules="modules" />
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
      addPageFormData: {
        title: '',
      },

      modules: [],
    }
  },
  async created () {
    this.$crm.pageList({ recordPagesOnly: true }).then(pp => {
      // @todo extend API endpoint to support fetching only record pages
      this.$crm.moduleList({}).then(mm => {
        this.modules = mm.map(m => {
          m.recordPage = pp.find(p => p.moduleID === m.moduleID)
          return m
        })
      })
    })

    this.$_initList()
  },
  methods: {
    async $_initList () {
      try {
        this.listError = ''
        this.$crm.pageTree({}).then((tree) => {
          const traverse = (pages) => {
            return pages.map((p) => {
              if (p.children) {
                p.children = traverse(p.children).filter((p) => p.moduleID === '0')
              }

              return p
            })
          }

          this.tree = traverse(tree.filter((p) => p.moduleID === '0'))
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

    handleReorder () {
      this.$_initList()
    },

    handleRecordPageCreation ({ moduleID }) {
      // This is called from record pages list as a request to create a (record) page that
      // with reference to a module

      const module = this.modules.find(m => m.moduleID === moduleID)
      const payload = {
        title: `Record page for module "${module.name || moduleID}"`,
        moduleID,
      }

      this.$crm.pageCreate(payload).then(page => {
        console.log(page)
        this.$router.push({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
      })
    },
  },

  components: {
    draggable,
    PageTree,
    RecordPagesList,
  },
}
</script>
