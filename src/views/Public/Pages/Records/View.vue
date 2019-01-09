<template>
  <div class="view">
    <div class="editor">
      <button class="btn-url" @click.prevent="handleBack">&#171; Back</button>
      <confirmation-toggle @confirmed="handleDelete" class="confirmation">Delete</confirmation-toggle>
      <button class="btn" @click.prevent="$router.push({ name: 'public.page.record.create' })">+ Add new</button>
      <button class="btn btn-blue" @click.prevent="handleUpdate" v-if="editMode">Save changes</button>
      <button class="btn" @click.prevent="$router.push({ name: 'public.page.record.edit' })" v-else>Edit</button>
    </div>
    <grid :page="page" :record="record" :edit-mode="editMode" v-if="record" />
    <b-modal id="deleteRecord" title="Delete record" @ok="handleDelete" ok-title="Delete" ok-variant="danger">
      <div class="d-block text-center">
        <h3>Are you sure you want to delete this record?</h3>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'

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
      record: undefined,

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
        this.$crm.moduleRecordRead({ moduleID: this.page.moduleID, recordID: this.recordID }).then(record => {
          this.record = new Record(this.page.module, record)
        }).catch(this.defaultErrorHandler('Could not load this record'))
      }
    },

    handleDelete () {
      this.$crm.moduleRecordDelete({ moduleID: this.record.moduleID, recordID: this.record.recordID }).then(rsp => {
        this.$router.push({ name: 'public.page' })
      }).catch(this.defaultErrorHandler('Could not delete this record'))
    },

    handleBack () {
      this.$router.back()
    },
  },

  components: {
    Grid,
    ConfirmationToggle,
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/_0.declare.scss";

.confirmation {
  margin-right: 0.5em;
}

</style>
