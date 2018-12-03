<template>
  <div class="view">
    <b-alert show variant="warning" dismissible @dismissed="warningAlert=null" v-if="warningAlert">{{ warningAlert }}</b-alert>
    <b-alert show variant="info" dismissible @dismissed="infoAlert=null" v-if="infoAlert">{{ infoAlert }}</b-alert>
    <div>
      <button class="btn btn-outline" @click="handleCreate">Save</button>
      <button class="btn btn-outline" @click.prevent="$router.push({ name: 'public.page.record.create' })">New</button>
      <button class="btn btn-outline" @click.prevent="$router.back()">Back</button>
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
