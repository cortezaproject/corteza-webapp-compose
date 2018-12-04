<template>
  <sortable-tree :data="{children:list}" element="ul" class="list-group" @changePosition="handleChangePosition">
      <template slot-scope="{item}">
        <div class="wrap" v-if="item.pageID">
          <div class="title">{{ item.title }}</div>
          <div class="prop-col">
            <span v-if="item.visible">Visible</span>
            <span v-else>Hidden</span>
          </div>
          <div class="actions">
              <router-link
                v-if="item.blocks && item.blocks.length >= 1"
                :to="{name: 'public.pages', params: { pageID: item.pageID }}"
                class="action">
                <font-awesome-icon
                  :icon="['far', 'eye']"
                  title="View"
                ></font-awesome-icon>
              </router-link>

              <div
                v-else
                class="action-disabled">
                </div>

              <router-link
                :to="{name: 'admin.pages.edit', params: { pageID: item.pageID }}"
                class="action">
                <i class="action icon-edit"></i>
              </router-link>

              <router-link
                :to="{name: 'admin.pages.builder', params: { pageID: item.pageID }}"
                class="btn">Page builder</router-link>
          </div>
        </div>
    </template>
  </sortable-tree>
</template>

<script>
import SortableTree from 'vue-sortable-tree'

export default {
  name: 'page-tree',

  props: {
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
    async handleChangePosition ({ beforeParent, data, afterParent }) {
      if (beforeParent.pageID !== afterParent.pageID) {
        // Page moved to a different parent
        data.pageID = data.pageID
        data.selfID = afterParent.pageID
        await this.$crm.pageEdit(data)
      }

      const pageIDs = afterParent.children.map(p => p.pageID)
      if (pageIDs.length > 1) {
        this.$crm.pageReorder({ selfID: afterParent.pageID, pageIDs: pageIDs }).then(() => {
          this.$emit('reorder')
        })
      }
    },
  },

  components: {
    SortableTree,
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";

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
        width: 60px;
      }

      .title {
        flex: 1;
        margin: 0 10px;
      }
    }
  }
}
</style>
