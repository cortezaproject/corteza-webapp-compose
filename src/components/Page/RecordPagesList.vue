<template>
    <table>
        <tbody>
            <tr v-for="(item) in value" :key="item.pageID">
                <td class="title">
                    {{ item.title }}

                </td>
                <td>
                    <router-link
                            :to="{name: 'admin.modules.edit', params: { moduleID: item.moduleID }}"
                            class="actions__action">module</router-link>
                </td>
                <td class="actions">
                    <router-link
                            v-if="item.blocks && item.blocks.length >= 1"
                            :to="{name: 'public.pages', params: { pageID: item.pageID }}"
                            class="actions__action">View page</router-link>

                    <div title="You need to build page to view your page !"
                         v-if="!item.blocks || item.blocks.length === 0"
                         class="actions__action--disabled">View page</div>

                    <router-link
                            :to="{name: 'admin.builder', query: { pageId: item.pageID }}"
                            class="actions__action">Build page</router-link>

                    <router-link
                            :to="{name: 'admin.pages.edit', params: { pageID: item.pageID }}"
                            class="actions__action">Edit data</router-link>

                    <confirmation-toggle @confirmed="$emit('delete', item.pageID)">Delete</confirmation-toggle>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'

export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
  },

  components: {
    ConfirmationToggle,
  },
}
</script>
<style lang="scss">
table {
  width: 100%;

  tbody {
    tr {
      td {
        &.actions {
          text-align: right;
          width: 200px;
        }
      }
    }
  }
}
</style>
