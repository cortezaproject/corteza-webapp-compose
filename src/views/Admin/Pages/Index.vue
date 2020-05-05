<template>
  <div class="py-3">
    <b-container>
      <b-row>
        <b-col md="12">
          <b-card class="mb-2">
            <b-row align-v="center">
              <b-col md="5">
                <b-form @submit.prevent="handleAddPageFormSubmit">
                  <b-form-group v-if="namespace.canCreatePage" :label="$t('page.newLabel')">
                    <b-input-group >
                      <input required type="text" v-model="page.title" class="form-control" id="name" :placeholder="$t('page.newPlaceholder')" />
                      <b-input-group-append>
                        <b-button type="submit" variant="dark">{{ $t('general.label.create') }}</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-form>
              </b-col>
              <b-col offset-md="5" md="2" class="text-right">
                <c-permissions-button
                  v-if="namespace.canGrant"
                  resource="compose:page:*"
                  link
                />
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <b-card :title="$t('page.title')">
            <page-tree
              :namespace="namespace"
              @reorder="handleReorder"
              v-model="tree"/>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PageTree from 'corteza-webapp-compose/src/components/Admin/Page/Tree'
import { compose } from '@cortezaproject/corteza-js'

export default {
  name: 'PageList',

  components: {
    PageTree,
  },

  props: {
    namespace: {
      type: compose.Namespace,
      required: false,
    },
  },

  data () {
    return {
      tree: [],
      page: new compose.Page({ visible: true }),
    }
  },

  created () {
    this.loadTree()
  },

  methods: {
    ...mapActions({
      createPage: 'page/create',
    }),

    loadTree () {
      const { namespaceID } = this.namespace
      this.$ComposeAPI.pageTree({ namespaceID }).then((tree) => {
        this.tree = tree.map(p => new compose.Page(p))
      }).catch(this.defaultErrorHandler(this.$t('notification.page.loadFailed')))
    },

    handleAddPageFormSubmit () {
      const { namespaceID } = this.namespace
      this.page.weight = this.tree.length
      this.createPage({ ...this.page, namespaceID }).then(({ pageID }) => {
        this.$router.push({ name: 'admin.pages.edit', params: { pageID } })
      }).catch(this.defaultErrorHandler(this.$t('notification.page.saveFailed')))
    },

    handleReorder () {
      this.loadTree()
    },
  },
}
</script>
<style lang="scss" scoped>
  /deep/ .exist-li {
    .content {
      background: rgba(0, 0, 0, 0.03);
    }
  }
</style>
