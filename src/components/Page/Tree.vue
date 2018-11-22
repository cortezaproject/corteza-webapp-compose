<template>
    <sortable-tree :data="{children:list}" element="ul" class="list-group" @changePosition="handleChangePosition">
        <template slot-scope="{item}">
            <div class="wrap" v-if="item.id">
                <div class="title">{{ item.title }}</div>
                <div class="actions">
                    <router-link
                            v-if="item.blocks && item.blocks.length >= 1"
                            :to="{name: 'public.pages', params: { pageID: item.id }}"
                            class="actions__action">View page</router-link>

                    <div title="You need to build page to view your page !"
                         v-if="!item.blocks || item.blocks.length === 0"
                         class="actions__action--disabled">View page</div>

                    <router-link
                            :to="{name: 'admin.builder', query: { pageId: item.id }}"
                            class="actions__action">Build page</router-link>

                    <router-link
                            :to="{name: 'admin.pages.edit', params: { pageID: item.id }}"
                            class="actions__action">Edit data</router-link>

                    <button
                            type="button"
                            class="btn btn-default actions__action"
                            @click="$emit('delete', item.id)">Delete</button>
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
      // This is fired only on an actual change.
      // @todo selfID=0 assumption
      console.log({ beforeParent: beforeParent.title, data: data.title, afterParent: afterParent.title })

      if (beforeParent.id !== afterParent.id) {
        // Page moved to a different parent
        data.pageID = data.id
        data.selfID = afterParent.id
        await this.$crm.pageEdit(data)
      }

      const pageIDs = afterParent.children.map(p => p.id)
      if (pageIDs.length > 1) {
        this.$crm.pageReorder({ selfID: afterParent.id, pageIDs: pageIDs }).then(() => {
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

      .title {
        flex: 1;
        margin: 0 10px;
      }

      .actions {
        a {
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
