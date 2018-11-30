<template>
    <table>
        <thead>
            <tr>
                <th>Module</th>
                <th></th>
            </tr>
        </thead>
        <tbody class="table table-stripped">
            <tr v-for="(m, index) in modules" :key="index">
                <td class="title">{{ m.name }}</td>
                <td class="actions">
                  <router-link
                    v-if="m.recordPage"
                    :to="{name: 'admin.pages.builder', params: { pageID: m.recordPage.pageID }}"
                    class="btn">Page builder</router-link>
                  <button
                    v-if="!m.recordPage"
                    @click="$emit('createRecordPage', { moduleID: m.moduleID })"
                    class="btn">Page builder</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'

export default {
  props: {
    modules: {
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
@import '@/assets/sass/_0.commons.scss';
@import "@/assets/sass/btns.scss";

table {
  width: 100%;

  tbody {
    tr {
      td {
        &.actions {
          text-align: right;
          width: 200px;
        }

        .btn {
          color: $black;
        }
      }
    }
  }
}
</style>
