<template>
  <div class="container">
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
  name: 'PageList',
  data () {
    return {
      tree: [],
      addPageFormData: {
        title: '',
        blocks: [],
      },

      modules: [],
    }
  },

  created () {
    this.$crm.pageList({ recordPagesOnly: true }).then(pp => {
      // @todo extend API endpoint to support fetching only record pages
      this.$crm.moduleList({}).then(mm => {
        this.modules = mm.map(m => {
          m.recordPage = pp.find(p => p.moduleID === m.moduleID)
          return m
        })
      })
    })

    this.loadTree()
  },

  methods: {
    loadTree () {
      this.$crm.pageTree({}).then((tree) => {
        this.tree = tree
      }).catch(this.defaultErrorHandler('Could not load the page tree'))
    },

    handleAddPageFormSubmit () {
      this.$crm.pageCreate(this.addPageFormData).then((page) => {
        this.$router.push({ name: 'admin.pages.edit', params: { pageID: page.pageID } })
      }).catch(this.defaultErrorHandler('Could not save this page'))
    },

    handleReorder () {
      this.loadTree()
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
        this.$router.push({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
      }).catch(this.defaultErrorHandler('Could not save this page'))
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
