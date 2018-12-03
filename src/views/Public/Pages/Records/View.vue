<template>
  <div class="view">
    <b-alert show variant="warning" dismissible @dismissed="warningAlert=null" v-if="warningAlert">{{ warningAlert }}</b-alert>
    <b-alert show variant="info" dismissible @dismissed="infoAlert=null" v-if="infoAlert">{{ infoAlert }}</b-alert>
    <div>
      <button class="btn btn-outline" @click.prevent="handleUpdate" v-if="editMode">Save changes</button>
      <button class="btn btn-outline" @click.prevent="$router.push({ name: 'public.page.record.edit' })" v-else>Edit</button>
      <button class="btn btn-outline" @click.prevent="$router.push({ name: 'public.page.record.create' })">New</button>
      <button class="btn btn-outline" v-b-modal.deleteRecord>Delete</button>
      <button class="btn btn-outline" @click.prevent="$router.back()">Back</button>
    </div>
    <grid :page="page" :record="record" :edit-mode="editMode" />
    <b-modal id="deleteRecord" title="Delete record" @ok="handleDelete" ok-title="Delete" ok-variant="danger">
      <div class="d-block text-center">
        <h3>Are you sure you want to delete this record?</h3>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'

export default {
  name: 'ViewRecord',

  props: {
    // Receives page object via router-view component
    page: {
      type: Object,
      required: true,
    },

    recordID: {
      type: String,
      required: false,
    },
  },

  data () {
    return {
      infoAlert: null,
      warningAlert: null,

      record: {},

      // We handle edit mode here because EditRecord components
      // is extending us
      editMode: false,
    }
  },

  watch: {
    recordID () {
      this.loadRecord()
    },
  },

  mounted () {
    this.loadRecord()
  },

  methods: {
    loadRecord () {
      this.record = null
      if (this.page && this.recordID && this.page.moduleID) {
        this.$crm.moduleContentRead({ moduleID: this.page.moduleID, contentID: this.recordID }).then(record => {
          this.record = record
        }).catch(err => {
          console.error(err)
          this.warningAlert = 'Internal error, could not load this record'
        })
      }
    },

    handleDelete () {
      this.$crm.moduleContentDelete({ moduleID: this.record.moduleID, contentID: this.record.contentID }).then(rsp => {
        if (rsp && rsp.success) {
          this.$router.push({ name: 'public.page' })
        } else {
          console.error(rsp)
          this.warningAlert = rsp.message
        }
      }).catch(err => {
        console.error(err)
        this.warningAlert = 'Internal error, could not delete this record'
      })
    },
  },

  components: {
    Grid,
  },
}
</script>
