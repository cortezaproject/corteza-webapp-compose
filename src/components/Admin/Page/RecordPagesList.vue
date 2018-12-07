<template>
    <table>
        <thead>
            <tr>
                <th>Module</th>
                <th></th>
            </tr>
        </thead>
        <tbody class="table">
            <tr v-for="(m, index) in modules" :key="index">
                <td class="title">{{ m.name }}</td>
                <td class="actions">
                  <router-link
                    v-if="m.recordPage && m.recordPage.blocks && m.recordPage.blocks.length >= 1"
                    :to="{name: 'public.page', params: { pageID: m.recordPage.pageID }}"
                    class="action">
                    <font-awesome-icon
                      :icon="['far', 'eye']"
                      title="View"
                    ></font-awesome-icon>
                  </router-link>
                  <router-link
                    v-if="m.recordPage"
                    :to="{name: 'admin.pages.builder', params: { pageID: m.recordPage.pageID }}"
                    class="btn-url">Page builder</router-link>
                  <a href="#"
                    v-if="!m.recordPage"
                    @click="$emit('createRecordPage', { moduleID: m.moduleID })"
                    class="btn-url">Page builder</a>
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
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

</style>
