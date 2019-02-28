<template>
  <div :class="[editMode ? 'edit': 'view']">
    <toolbar :back-link="{name: 'admin.pages'}"
                    @delete="handleDelete"
                    @save="handleUpdate()">

      <button class="btn"
              @click.prevent="$router.push({ name: 'public.page.record.create' })">+ Add new</button>

      <button class="btn btn-blue"
              :disabled="!record || !record.isValid()"
              @click.prevent="handleUpdate" v-if="editMode">Save</button>

      <button class="btn"
              @click.prevent="$router.push({ name: 'public.page.record.edit' })" v-else>Edit</button>
    </toolbar>
    <grid :page="page" :record="record" :edit-mode="editMode" v-if="record" @reload="loadRecord()" />
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
import Record from '@/lib/record'
import triggerRunner from '@/mixins/trigger_runner'
import Toolbar from '@/components/Public/Page/Toolbar'

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

  computed: {
    module () {
      if (this.page.moduleID) {
        return this.$store.getters['module/getByID'](this.page.moduleID)
      }
    },
  },

  mounted () {
    this.loadRecord()
  },

  methods: {
    loadRecord () {
      this.record = null
      if (this.page && this.recordID && this.page.moduleID) {
        this.$crm.recordRead({ moduleID: this.page.moduleID, recordID: this.recordID }).then(record => {
          this.record = new Record(this.module, record)
        }).catch(this.defaultErrorHandler('Could not load this record'))
      }
    },

    handleDelete () {
      this.deleteRecord(this.module, this.record)
        .then(() => {
          this.$router.push({ name: 'public.page', params: { pageID: this.page.pageID } })
        })
        .catch(this.defaultErrorHandler('Could not delete this record'))
    },

    handleBack () {
      this.$router.back()
    },
  },

  components: {
    Grid,
    ConfirmationToggle,
    Toolbar,
  },

  mixins: [
    triggerRunner,
  ],
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/_0.declare.scss";

.confirmation {
  margin-right: 0.5em;
}

</style>
