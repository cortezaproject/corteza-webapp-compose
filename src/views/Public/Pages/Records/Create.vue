<template>
  <div>
    <grid :namespace="namespace"
          :page="page"
          :record="record"
          v-if="record" edit-mode />
    <toolbar :back-link="{name: 'admin.pages'}"
             :read-only="!module.canUpdateRecord"
             :hide-delete="true">
      <div class="d-inline-block text-white">_</div>
      <b-button v-if="module.canCreateRecord"
                variant="primary"
                class="float-right"
                :disabled="!record.isValid()"
                @click.prevent="handleCreate">{{ $t('general.label.save') }}</b-button>
    </toolbar>
  </div>
</template>
<script>
import Grid from 'corteza-webapp-compose/src/components/Public/Page/Grid'
import uiScriptRunner from 'corteza-webapp-compose/src/mixins/ui-script-runner'
import { compose } from '@cortezaproject/corteza-js'
import Toolbar from 'corteza-webapp-compose/src/components/Public/Page/Toolbar'

export default {
  name: 'CreateRecord',

  components: {
    Grid,
    Toolbar,
  },

  mixins: [
    uiScriptRunner,
  ],

  props: {
    page: { // via router-view
      type: compose.Page,
      required: false,
    },

    namespace: { // via router-view
      type: compose.Namespace,
      required: true,
    },

    refRecord: {
      type: Object,
      required: false,
    },

    values: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },

  data () {
    return {
      record: null,
    }
  },

  computed: {
    module () {
      if (this.page.moduleID) {
        return this.$store.getters['module/getByID'](this.page.moduleID)
      }

      return undefined
    },
  },

  created () {
    this.record = new compose.Record(this.module, { values: this.values })

    if (this.refRecord) {
      // Record create form called from a related records block,
      // we'll try to find an appropriate field and cross-link this new record to ref
      const recRefField = this.module.fields.find(f => f.kind === 'Record' && f.options.moduleID === this.refRecord.moduleID)
      if (recRefField) {
        this.record.values[recRefField.name] = this.refRecord.recordID
      }
    }
  },

  methods: {
    handleCreate () {
      this.createRecord(this.namespace, this.module, this.record)
        .then((record) => {
          this.$router.push({ name: 'page.record', params: { ...this.$route.params, recordID: record.recordID } })
        })
        .catch(this.defaultErrorHandler(this.$t('notification.record.createFailed')))
    },
  },
}
</script>
