<template>
  <sortable-tree
    :draggable="namespace.canCreatePage"
    :data="{children:list}"
    element="ul"
    mixinParentKey="parent"
    class="list-group"
    @changePosition="handleChangePosition">

      <template slot-scope="{item}">
        <div class="wrap d-flex" v-if="item.pageID">
          <div class="flex-fill ml-1" :class="{'grab': namespace.canCreatePage}">
            {{ item.title }}
          </div>
          <div class="prop-col text-left">
            <span v-if="item.moduleID !== '0'">{{ $t('page.recordPage') }}</span>
            <span v-else-if="item.visible">{{ $t('page.visible') }}</span>
          </div>
          <div class="fixed-width text-right">
          <router-link
            v-if="item.blocks && item.blocks.length >= 1"
            :to="{name: 'page', params: { pageID: item.pageID }}"
            class="mr-2 text-dark d-inline-block">
            <font-awesome-icon
              :icon="['far', 'eye']"
              :title="$t('general.label.view')"
            ></font-awesome-icon>
          </router-link>
          <router-link v-if="item.canUpdatePage"
                       :to="{name: 'admin.pages.builder', params: { pageID: item.pageID }}"
                       class="mr-2 text-dark">{{ $t('general.label.pageBuilder') }}</router-link>
          <router-link v-if="item.canUpdatePage"
                       :to="{name: 'admin.pages.edit', params: { pageID: item.pageID }}"
                       class="mr-2 text-dark d-inline-block edit">
            <font-awesome-icon :icon="['far', 'edit']" v-if="item.moduleID === '0'"></font-awesome-icon>
          </router-link>
         <permissions-button v-if="namespace.canGrant"
                             :title="item.title"
                             :resource="'compose:page:'+item.pageID" link />
          </div>
        </div>
    </template>
  </sortable-tree>
</template>

<script>
import SortableTree from 'vue-sortable-tree'
import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'

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
      const beforeID = beforeParent.parent ? beforeParent.pageID : '0'
      const afterID = afterParent.parent ? afterParent.pageID : '0'

      const reorder = () => {
        const pageIDs = afterParent.children.map(p => p.pageID)
        if (pageIDs.length > 1) {
          this.$ComposeAPI.pageReorder({ namespaceID, selfID: afterID, pageIDs: pageIDs }).then(() => {
            this.raiseSuccessAlert(this.$t('notification.page.reordered'))
            this.$emit('reorder')
          }).catch(this.defaultErrorHandler(this.$t('notification.page.pageMoveFailed')))
        }
      }

      if (beforeID !== afterID) {
        // Page moved to a different parent
        data.selfID = afterID
        data.namespaceID = namespaceID

        this.$ComposeAPI.pageUpdate(data).then(() => {
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

ul {
  li {
    div.wrap {
      font-size: 0.9em;

      div.prop-col {
        font-size: 0.8em;
      }
    }
  }
}

.fixed-width {
  width: 170px;
}

.edit {
  width: 25px;
}

.grab {
  cursor: grab;
}
</style>
