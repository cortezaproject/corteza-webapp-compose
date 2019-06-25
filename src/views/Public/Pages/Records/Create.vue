<template>
  <div class="view">
    <toolbar :back-link="{name: 'admin.pages'}"
             :read-only="!module.canUpdateRecord"
             :hide-delete="true">
      <b-button v-if="module.canCreateRecord"
                pill
                variant="primary"
                class="float-right"
                :disabled="!record.isValid()"
                @click.prevent="handleCreate">{{ $t('general.label.save') }}</b-button>
    </toolbar>
    <grid :namespace="namespace"
          :page="page"
          :record="record"
          v-if="record" edit-mode />
  </div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'
import triggerRunner from '@/mixins/trigger_runner'
import Namespace from '@/lib/namespace'
import Page from '@/lib/page'
import Record from '@/lib/record'
import Toolbar from '@/components/Public/Page/Toolbar'

export default {
  name: 'CreateRecord',

  components: {
    Grid,
    Toolbar,
  },

  mixins: [
    triggerRunner,
  ],

  props: {
    page: { // via router-view
      type: Page,
      required: false,
    },

    namespace: { // via router-view
      type: Namespace,
      required: true,
    },

    refRecord: {
      type: Object,
      required: false,
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
    },
  },

  created () {
    this.record = new Record(this.module, {})

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
          this.$router.push({ name: 'page.record.edit', params: { ...this.$route.params, recordID: record.recordID } })
        })
        .catch(this.defaultErrorHandler(this.$t('notification.record.createFailed')))
    },
  },
}
</script>
