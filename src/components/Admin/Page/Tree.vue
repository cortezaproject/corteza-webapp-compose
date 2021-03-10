<template>
  <sortable-tree
    :draggable="namespace.canCreatePage"
    :data="{children:list}"
    tag="ul"
    mixinParentKey="parent"
    class="list-group"
    @changePosition="handleChangePosition">
    <template
      slot-scope="{item}"
    >
      <b-row
        no-gutters
        v-if="item.pageID"
        class="wrap d-flex pr-2"
        :class="{ 'bg-warning': !isValid(item) }"
      >
        <b-col
          cols="12"
          xl="6"
          lg="5"
          class="flex-fill pl-2"
          :class="{'grab': namespace.canCreatePage}"
        >
          {{ item.title }}
        </b-col>
        <b-col
          cols="12"
          xl="6"
          lg="7"
          class="text-right"
        >
          <span class="text-right ml-3">
            <span
              class="d-none d-md-inline-block mr-5"
            >
              <span
                v-if="item.moduleID !== '0'"
              >
                <i18next
                  path="page.recordPage"
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
            </span>
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
              class="mr-2"
            >
              {{ $t('general.label.pageBuilder') }}
            </router-link>
            <c-permissions-button
              v-if="namespace.canGrant"
              :title="item.title"
              :target="item.title"
              :resource="'compose:page:'+item.pageID"
              link
            />
            <router-link
              v-if="item.canUpdatePage"
              :to="{name: 'admin.pages.edit', params: { pageID: item.pageID }}"
              class="ml-2 d-inline-block edit"
            >
              <font-awesome-icon
                v-if="item.moduleID === '0'"
                :icon="['far', 'edit']"
              />
            </router-link>
          </span>
        </b-col>
      </b-row>
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
        data.weight = 1
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
.edit {
  width: 30px;
}

.grab {
  cursor: grab;
  z-index: 1;
}
</style>
