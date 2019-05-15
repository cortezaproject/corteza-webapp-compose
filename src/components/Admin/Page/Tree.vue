<template>
  <sortable-tree :data="{children:list}" element="ul" class="list-group" @changePosition="handleChangePosition">
      <template slot-scope="{item}">
        <div class="wrap" v-if="item.pageID">
          <div class="title">{{ item.title }}</div>
          <div class="prop-col">
            <span v-if="item.moduleID !== '0'">{{ $t('page.recordPage') }}</span>
            <span v-else-if="item.visible">{{ $t('page.visible') }}</span>
          </div>
          <div class="actions">
              <router-link
                v-if="item.blocks && item.blocks.length >= 1"
                :to="{name: 'page', params: { pageID: item.pageID }}"
                class="action">
                <font-awesome-icon
                  :icon="['far', 'eye']"
                  :title="$t('general.label.view')"
                ></font-awesome-icon>
              </router-link>

              <div
                v-else
                class="action-disabled">
                </div>

              <router-link :to="{name: 'admin.pages.builder', params: { pageID: item.pageID }}"
                           class="btn-url">{{ $t('general.label.pageBuilder') }}</router-link>

              <router-link :to="{name: 'admin.pages.edit', params: { pageID: item.pageID }}"
                           class="edit action">
                <i class="action icon-edit" v-if="item.moduleID === '0'"></i>
              </router-link>

              <permissions-button :resource="'compose:page:'+item.pageID" link />
          </div>
        </div>
    </template>
  </sortable-tree>
</template>

<script>
import SortableTree from 'vue-sortable-tree'
import Namespace from '@/lib/namespace'

export default {
  name: 'page-tree',

  components: {
    SortableTree,
  },

  props: {
    namespace: {
      type: Namespace,
      required: true,
    },

    value: {
      type: Array,
      required: true,
    },

    parentID: {
      type: String,
      default: '0',
    },

    level: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    list: {
      get () {
        return this.value
      },

      set (pages) {
        this.$emit('input', pages.filter(p => p))
      },
    },
  },

  methods: {
    handleChangePosition ({ beforeParent, data, afterParent }) {
      const { namespaceID } = this.namespace

      const reorder = () => {
        const pageIDs = afterParent.children.map(p => p.pageID)
        if (pageIDs.length > 1) {
          this.$compose.pageReorder({ namespaceID, selfID: afterParent.pageID || '0', pageIDs: pageIDs }).then(() => {
            this.raiseSuccessAlert(this.$t('notification.page.reordered'))
            this.$emit('reorder')
          }).catch(this.defaultErrorHandler(this.$t('notification.page.pageMoveFailed')))
        }
      }

      if (beforeParent.pageID !== afterParent.pageID) {
        // Page moved to a different parent
        data.selfID = afterParent.pageID
        data.namespaceID = namespaceID

        this.$compose.pageUpdate(data).then(() => {
          reorder()
        }).catch(this.defaultErrorHandler(this.$t('notification.page.pageMoveFailed')))
      } else {
        reorder()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

ul {
  li {
    div.wrap {
      font-size: 0.9em;
      display: flex;
      background-color: $appwhite;
      margin: 0 0 0 5px;
      padding: 1px;
      cursor: move;
      cursor: -webkit-grabbing;

      div.prop-col {
        text-align: left;
        font-size: 0.8em;
        width: 100px;
      }

      .title {
        flex: 1;
        margin: 0 10px;
      }

      .edit {
        width: 30px;
        display: inline-block;
      }
    }
  }
}

.btn {
  border-radius: 0;
  margin-right: 0;
}

.btn-url {
  margin-left: 5px;
}
</style>
