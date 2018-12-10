<template>
  <div class="view">
    <b-alert show variant="warning" dismissible @dismissed="warningAlert=null" v-if="warningAlert">{{ warningAlert }}</b-alert>
    <b-alert show variant="info" dismissible @dismissed="infoAlert=null" v-if="infoAlert">{{ infoAlert }}</b-alert>
    <div class="editor">
      <button class="btn-url" @click.prevent="$router.back()">&#171; Back</button>
      <button class="btn" @click.prevent="$router.push({ name: 'public.page.record.create' })">+ Add new</button>
      <button class="btn btn-blue" @click="handleCreate">Save changes</button>
    </div>
    <grid :page="page" :record="record" edit-mode />
  </div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'

export default {
  name: 'CreateRecord',

  props: {
    // Receives page object via router-view component
    page: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      record: { fields: [] },
    }
  },

  methods: {
    handleCreate () {
      const payload = {
        moduleID: this.page.moduleID,
        fields: this.record.fields,
      }

      this.$crm.moduleContentCreate(payload).then((rsp) => {
        this.$router.push({ name: 'public.page.record.edit', params: { recordID: rsp.contentID } })
      }).catch(err => {
        console.error(err)
        this.warningAlert = 'Internal error, could not store this record'
      })
    },
  },

  components: {
    Grid,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/_0.declare.scss";

.editor {
  .btn {
    margin-right: 0;
  }
}

.alert {
  position: absolute;
  z-index: 1;
  width: 100%;
  box-shadow: 0 0 2px 0 rgba($appgrey, 0.75);
}
</style>
