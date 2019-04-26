<template>
  <div class="scrollable">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well">
            <div class="title-bar">
              <h2>{{ $t('page.title')}}</h2>
              <div class="title-actions actions">
                <a v-b-modal="'pagePermissions'" class="action">
                  <i class="action icon-fatlock" />
                </a>
                <permission-modal id="pagePermissions" filter="page" targetAll/>
              </div>
            </div>
            <page-tree
              @reorder="handleReorder"
              v-model="tree"/>
            <form @submit.prevent="handleAddPageFormSubmit">
              <b-form-group :label="$t('page.newLabel')">
                <b-input-group>
                  <input required type="text" v-model="addPageFormData.title" class="form-control" id="name" :placeholder="$t('page.newPlaceholder')" />
                  <b-input-group-append>
                    <button type="submit" class="btn btn-dark">{{ $t('general.label.create') }}</button>
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
import PermissionModal from '@/components/Admin/Permissions/PermissionModal'

export default {
  name: 'PageList',

  components: {
    draggable,
    PageTree,
    PermissionModal,
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
      }).catch(this.defaultErrorHandler(this.$t('notification.page.loadFailed')))
    },

    handleAddPageFormSubmit () {
      this.$crm.pageCreate(this.addPageFormData).then((page) => {
        this.$router.push({ name: 'admin.pages.edit', params: { pageID: page.pageID } })
      }).catch(this.defaultErrorHandler(this.$t('notification.page.saveFailed')))
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

.title-actions {
  padding-bottom: 10px;
  margin-bottom: 0.5rem;
  line-height: 1;
  text-align: right;
  float: right;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

form {
  margin-top: 50px;
}
</style>
