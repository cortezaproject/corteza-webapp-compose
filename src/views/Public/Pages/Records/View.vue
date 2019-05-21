<template>
  <div :class="[editMode ? 'edit': 'view']">
    <toolbar :back-link="{name: 'pages'}"
                    :hideDelete="!module.canDeleteRecord"
                    @delete="handleDelete"
                    @save="handleUpdate()">

      <button v-if="module.canCreateRecord"
              class="btn"
              @click.prevent="$router.push({ name: 'page.record.create', params: $route.params })">+ {{ $t('general.label.addNew') }}</button>

      <button v-if="!editMode && module.canUpdateRecord"
              class="btn"
              @click.prevent="$router.push({ name: 'page.record.edit', params: $route.params })" >{{ $t('general.label.edit') }}</button>

      <button v-if="module.canUpdateRecord"
              class="btn btn-blue"
              :disabled="!record || !record.isValid()"
              @click.prevent="handleUpdate"
              >{{ $t('general.label.save') }}</button>

    </toolbar>
    <grid :namespace="namespace"
          :page="page"
          :record="record"
          :edit-mode="editMode"
          v-if="record"
          @reload="loadRecord()" />
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
import Namespace from '@/lib/namespace'
import Page from '@/lib/page'

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
    namespace: { // via router-view
      type: Namespace,
      required: true,
    },

    page: { // via router-view
      type: Page,
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
    recordID: {
      immediate: true,
      handler () {
        this.loadRecord()
      },
    },
  },

  methods: {
    loadRecord () {
      this.record = null
      if (this.page && this.recordID && this.page.moduleID) {
        const { namespaceID, moduleID } = this.page
        this.$compose.recordRead({ namespaceID, moduleID, recordID: this.recordID }).then(record => {
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
