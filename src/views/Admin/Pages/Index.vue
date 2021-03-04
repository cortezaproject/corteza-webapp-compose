<template>
  <div class="py-3">
    <b-container fluid>
      <b-row no-gutters>
        <b-col xl="8" offset-xl="2">
          <h1>{{ $t('page.title') }}</h1>
          <b-card :title="$t('page.title')" no-body>
            <b-card-header header-bg-variant="white" class="pb-0">
              <b-row no-gutters>
                <b-col cols="10" md="6">
                  <b-form @submit.prevent="handleAddPageFormSubmit" class="pb-0">
                    <b-form-group v-if="namespace.canCreatePage" class="mb-0">
                      <b-input-group>
                        <input required type="text" v-model="page.title" class="form-control" id="name" :placeholder="$t('page.newPlaceholder')" />
                        <b-input-group-append>
                          <b-button type="submit" variant="primary">{{ $t('general.label.create') }}</b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-form>
                </b-col>
                <b-col cols="2" md="6">
                  <c-permissions-button
                    v-if="namespace.canGrant"
                    resource="compose:page:*"
                    class="float-right mt-1 mr-4"
                    link
                  />
                </b-col>
              </b-row>
            </b-card-header>
            <page-tree
              :namespace="namespace"
              class="pb-2"
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
<style lang="scss">
//!important usage to over-ride library styling
$content-height: 50px;
$blank-li-height: 0;
$left-padding: 5px;
$border-color: #E4E9EF;
$hover-color: rgba(0, 0, 0, 0.075);
$dropping-color: #90A3B1;

.sortable-tree {
  ul {
    .content {
      height: 100% !important;
      min-height: $content-height !important;
      line-height: $content-height !important;

      &:hover {
        background: $hover-color;
      }
    }
  }

  li {
    white-space: nowrap;
    background: white;

    &.blank-li {
      padding-top: 1px !important;
      height: $blank-li-height !important;
    }

    &::before {
      top: $content-height / -2 !important;
      border-left: 2px solid $border-color !important;
    }

    &::after {
      height: $content-height !important;
      top: $content-height / 2 !important;
      border-color: #fff !important;
    }

    &.parent-li:nth-last-child(2)::before {
      height: $content-height !important;
      top: $content-height / -2 !important;
    }
  }

  .parent-li {
    border-top: 1px solid $border-color;

    .exist-li {
      border-top: none;

      &::after {
        border-top: 2px solid $border-color !important;
      }
    }
  }
}

.droper {
  background: $dropping-color !important;
}

</style>
