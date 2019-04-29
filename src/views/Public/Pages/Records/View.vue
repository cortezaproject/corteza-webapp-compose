<template>
  <div :class="[editMode ? 'edit': 'view']">
    <toolbar :back-link="{name: 'admin.pages'}"
                    @delete="handleDelete"
                    @save="handleUpdate()">

      <button class="btn"
              @click.prevent="$router.push({ name: 'page.record.create' })">+ {{ $t('general.label.addNew') }}</button>

      <button class="btn btn-blue"
              :disabled="!record || !record.isValid()"
              @click.prevent="handleUpdate" v-if="editMode">{{ $t('general.label.save') }}</button>

      <button class="btn"
              @click.prevent="$router.push({ name: 'page.record.edit' })" v-else>{{ $t('general.label.edit') }}</button>
    </toolbar>
    <grid :page="page" :record="record" :edit-mode="editMode" v-if="record" @reload="loadRecord()" />
    <b-modal id="deleteRecord" :title="$t('block.record.deleteRecord')" @ok="handleDelete" :ok-title="$t('general.label.delete')" ok-variant="danger">
      <div class="d-block text-center">
        <h3>{{ $t('block.record.confirmDelete') }}</h3>
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

  components: {
    Grid,
    ConfirmationToggle,
    Toolbar,
  },

  mixins: [
    triggerRunner,
  ],

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

  computed: {
    module () {
      if (this.page.moduleID) {
        return this.$store.getters['module/getByID'](this.page.moduleID)
      }
    },
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
        this.$compose.recordRead({ moduleID: this.page.moduleID, recordID: this.recordID }).then(record => {
          this.record = new Record(this.module, record)
        }).catch(this.defaultErrorHandler(this.$t('notification.record.loadFailed')))
      }
    },

    handleDelete () {
      this.deleteRecord(this.module, this.record)
        .then(() => {
          this.$router.push({ name: 'page', params: { pageID: this.page.pageID } })
        })
        .catch(this.defaultErrorHandler(this.$t('notification.record.deleteFailed')))
    },

    handleBack () {
      this.$router.back()
    },
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
