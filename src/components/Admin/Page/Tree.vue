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
                <i class="action icon-zoom"></i>
              </router-link>

              <div
                v-else
                class="action-disabled">
                </div>

              <router-link
                :to="{name: 'admin.pages.builder', params: { pageID: item.pageID }}"
                class="btn">Page builder</router-link>

              <confirmation-toggle @confirmed="$emit('delete', item.pageID)" class="confirmation">Delete</confirmation-toggle>

              <router-link
                :to="{name: 'admin.pages.edit', params: { pageID: item.pageID }}"
                class="action">
                <i class="action icon-edit"></i>
              </router-link>
          </div>
        </div>
    </template>
  </sortable-tree>
</template>

<script>
import SortableTree from 'vue-sortable-tree'
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'

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

  data () {
    return {
      draggableOptions: {
        group: `pages`,
        draggable: '.list-group-item',
        handle: '.sort-handle',
        animation: 50,
      },
    }
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
    ConfirmationToggle,
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
        width: 70px;
      }

      .title {
        flex: 1;
        margin: 0 10px;
      }
    }
  }
}
</style>
