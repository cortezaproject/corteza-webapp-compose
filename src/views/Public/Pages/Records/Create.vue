<template>
  <div>
    <grid
      :namespace="namespace"
      :page="page"
      :module="module"
      :record="record"
      v-if="record" edit-mode
    />
    <toolbar
      :back-link="{name: 'admin.pages'}"
      :read-only="!module.canUpdateRecord"
      :hide-delete="true"
    >
      <div class="d-inline-block text-white">_</div>
      <b-button
        v-if="module.canCreateRecord"
        variant="primary"
        class="float-right"
        :disabled="!isValid"
        @click.prevent="handleFormSubmit"
      >
        {{ $t('general.label.save') }}
      </b-button>
    </toolbar>
  </div>
</template>
<script>
import Grid from 'corteza-webapp-compose/src/components/Public/Page/Grid'
import Toolbar from 'corteza-webapp-compose/src/components/Public/Page/Toolbar'
import ViewRecord from './View'
import { compose } from '@cortezaproject/corteza-js'

export default {
  name: 'CreateRecord',

  components: {
    Grid,
    Toolbar,
  },

  extends: ViewRecord,

  props: {
    // When creating from related record blocks
    refRecord: {
      type: compose.Record,
      required: false,
    },

    // If component was called with some pre-seed values
    values: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },

  data () {
    return {
      record: undefined,
    }
  },

  computed: {
    errors () {
      if (this.validator) {
        return this.validator.run(this.record).get()
      }

      return []
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
}
</script>
