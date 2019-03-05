<template>
  <div class="scrollable">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well">
            <h2>List of pages</h2>
            <page-tree
              @reorder="handleReorder"
              v-model="tree"/>
            <form @submit.prevent="handleAddPageFormSubmit">
              <b-form-group label="Create a new page:">
                <b-input-group>
                  <input required type="text" v-model="addPageFormData.title" class="form-control" id="name" placeholder="Page title" />
                  <b-input-group-append>
                    <button type="submit" class="btn btn-dark">Create</button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </form>
          </div>
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

  components: {
    draggable,
    PageTree,
  },

  data () {
    return {
      tree: [],
      addPageFormData: {
        title: '',
        blocks: [],
      },
    }
  },

  created () {
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
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

table {
  width: 100%;
}

.btn {
  border-radius: 0;
}

form {
  margin-top: 50px;
}
</style>
