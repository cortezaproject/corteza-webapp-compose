<template>
  <div class="container">
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
          <form @submit.prevent="handleAddPageFormSubmit">
            <div class="form-group form-inline">
              <label for="title">Create a new page:</label>
              <input required type="text" v-model="addPageFormData.title" class="form-control" id="title" placeholder="Page title" />
              <button type="submit" class="btn btn-dark">Create</button>
            </div>
            <div v-if="addPageFormSubmitError" style="color:red;">
              {{ addPageFormSubmitError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import PageTree from '@/components/Admin/Page/Tree'

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
          this.tree = tree
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
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

table {
  width: 100%;
}

label {
  margin: 20px 0 5px;
}

.form-inline {
  .form-control {
    margin-right: 10px;
    width: calc(100% - 80px);
  }
}

.form-group {
  margin-bottom: 0;
}
</style>
