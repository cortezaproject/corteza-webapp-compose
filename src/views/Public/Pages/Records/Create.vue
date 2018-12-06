<template>
  <div class="view">
    <b-alert show variant="warning" dismissible @dismissed="warningAlert=null" v-if="warningAlert">{{ warningAlert }}</b-alert>
    <b-alert show variant="info" dismissible @dismissed="infoAlert=null" v-if="infoAlert">{{ infoAlert }}</b-alert>
    <div class="editor">
      <button class="btn-url" @click.prevent="$router.back()">Back</button>
      <button class="btn" @click.prevent="$router.push({ name: 'public.page.record.create' })">Add new</button>
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
  background: $white;
  padding: 15px;
  text-align: right;
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 3;
  border-top: 3px solid $appblue;

  .btn-url {
    margin-left: 10px;
    float: left;

    &::before {
      content: "< ";
    }
  }

  .btn {
    margin-right: 0;
  }
}

</style>
