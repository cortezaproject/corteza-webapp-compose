<template>
  <sortable-tree
    :draggable="namespace.canCreatePage"
    :data="{children:list}"
    element="ul"
    mixinParentKey="parent"
    class="list-group"
    @changePosition="handleChangePosition">
    <template
      slot-scope="{item}"
    >
      <div
        v-if="item.pageID"
        class="wrap d-flex"
        :class="{ 'bg-warning': !isValid(item) }"
      >
        <div
          class="flex-fill ml-1"
          :class="{'grab': namespace.canCreatePage}"
        >
          {{ item.title }}
        </div>
        <div
          class="prop-col text-left"
        >
          <span
            v-if="item.moduleID !== '0'"
          >
            <i18next
              path="page.recordPage"
              tag="label"
            >
              <router-link
                :to="{ name: 'admin.modules.edit', params: { moduleID: item.moduleID }}"
              >
                {{ moduleName(item) }}
              </router-link>
            </i18next>
          </span>
          <span
            v-else-if="item.visible"
          >
            {{ $t('page.visible') }}
          </span>
          <span
            v-else-if="!item.visible"
            class="text-danger"
          >
            {{ $t('page.notVisible') }}
          </span>
        </div>
        <div class="fixed-width text-right ml-3">
          <router-link
            v-if="item.blocks && item.blocks.length >= 1"
            :to="{name: 'page', params: { pageID: item.pageID }}"
            class="mr-2 text-dark d-inline-block">
            <font-awesome-icon
              :icon="['far', 'eye']"
              :title="$t('page.preview')"
            />
          </router-link>
          <router-link
            v-if="item.canUpdatePage"
            :to="{name: 'admin.pages.builder', params: { pageID: item.pageID }}"
            class="mr-2 text-dark"
          >
            {{ $t('general.label.pageBuilder') }}
          </router-link>
          <router-link
            v-if="item.canUpdatePage"
            :to="{name: 'admin.pages.edit', params: { pageID: item.pageID }}"
            class="mr-2 text-dark d-inline-block edit"
          >
            <font-awesome-icon
              v-if="item.moduleID === '0'"
              :icon="['far', 'edit']"
            />
          </router-link>
          <c-permissions-button
            v-if="namespace.canGrant"
            :title="item.title"
            :target="item.title"
            :resource="'compose:page:'+item.pageID"
            link
          />
        </div>
      </div>
    </template>
  </sortable-tree>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SortableTree from 'vue-sortable-tree'
import { compose, NoID } from '@cortezaproject/corteza-js'

export default {
  name: 'page-tree',

  components: {
    SortableTree,
  },

  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    value: {
      type: Array,
      required: true,
    },

    parentID: {
      type: String,
      default: NoID,
    },

    level: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

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
    ...mapActions({
      updatePage: 'page/update',
    }),

    moduleName ({ moduleID }) {
      if (moduleID === NoID) {
        return ''
      }

      return (this.getModuleByID(moduleID) || {}).name
    },

    handleChangePosition ({ beforeParent, data, afterParent }) {
      const { namespaceID } = this.namespace
      const beforeID = beforeParent.parent ? beforeParent.pageID : NoID
      const afterID = afterParent.parent ? afterParent.pageID : NoID

      const reorder = () => {
        const pageIDs = afterParent.children.map(p => p.pageID)
        if (pageIDs.length > 1) {
          this.$ComposeAPI.pageReorder({ namespaceID, selfID: afterID, pageIDs: pageIDs }).then(() => {
            this.$store.dispatch('page/load', { namespaceID, clear: true, force: true })
            this.raiseSuccessAlert(this.$t('notification.page.reordered'))
            this.$emit('reorder')
          }).catch(this.defaultErrorHandler(this.$t('notification.page.pageMoveFailed')))
        }
      }

      if (beforeID !== afterID) {
        // Page moved to a different parent
        data.selfID = afterID
        data.namespaceID = namespaceID

        this.updatePage(data).then(() => {
          reorder()
        }).catch(this.defaultErrorHandler(this.$t('notification.page.pageMoveFailed')))
      } else {
        reorder()
      }
    },

    /**
     * Validates page, returns true if there are no problems with it
     *
     * @param {compose.Page} page
     * @returns {boolean}
     */
    isValid (page) {
      if (typeof page.validate === 'function') {
        return page.validate().length === 0
      }

      return true
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
