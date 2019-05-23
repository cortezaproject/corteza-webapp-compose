<template>
  <div class="scrollable">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well">
<<<<<<< HEAD
            <permissions-button v-if="namespace.canGrant" resource="compose:page:*" link  class="float-right"/>
            <h2>{{ $t('page.title')}}</h2>
=======
            <div class="title-bar">
              <h2>{{ $t('page.title')}}</h2>
              <div class="title-actions actions">
                <export :list="getPages" type="page" />
                <permissions-button v-if="namespace.canGrant" resource="compose:page:*" link />
              </div>
            </div>
>>>>>>> Create import export component
            <page-tree
              :namespace="namespace"
              @reorder="handleReorder"
              v-model="tree"/>
            <form @submit.prevent="handleAddPageFormSubmit" class="mt-4">
              <b-form-group v-if="namespace.canCreatePage" :label="$t('page.newLabel')">
                <b-input-group >
                  <input required type="text" v-model="addPageFormData.title" class="form-control" id="name" :placeholder="$t('page.newPlaceholder')" />
                  <b-input-group-append>
                    <b-button type="submit" variant="dark">{{ $t('general.label.create') }}</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </form>
            <import :namespaceID="namespace.namespaceID" type="page" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import PageTree from '@/components/Admin/Page/Tree'
import Page from '@/lib/page'
import Namespace from '@/lib/namespace'
import Import from '@/components/Admin/Import'
import Export from '@/components/Admin/Export'

export default {
  name: 'PageList',

  components: {
    draggable,
    PageTree,
    Import,
    Export,
  },

  props: {
    namespace: {
      type: Namespace,
      required: false,
    },
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

  computed: {
    getPages () {
      if (this.tree) {
        return this.tree.map(b => {
          return new Page(b)
        })
      }
    },
  },

  created () {
    this.loadTree()
  },

  methods: {
    loadTree () {
      const { namespaceID } = this.namespace
      this.$compose.pageTree({ namespaceID }).then((tree) => {
        this.tree = tree
      }).catch(this.defaultErrorHandler(this.$t('notification.page.loadFailed')))
    },

    handleAddPageFormSubmit () {
      const { namespaceID } = this.namespace
      this.$compose.pageCreate({ namespaceID, ...this.addPageFormData }).then((page) => {
        this.$router.push({ name: 'admin.pages.edit', params: { pageID: page.pageID } })
      }).catch(this.defaultErrorHandler(this.$t('notification.page.saveFailed')))
    },

    handleReorder () {
      this.loadTree()
    },
  },
}
</script>
