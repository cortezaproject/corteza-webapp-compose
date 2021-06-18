<template>
  <div
    class="h-100 px-2"
  >
    <portal to="topbar-title">
      {{ title }}
    </portal>
    <record-list-base
      :block="block"
      :page="page"
      :namespace="namespace"
      :boundingRect="boundingRect"
    />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { compose } from '@cortezaproject/corteza-js'
import RecordListBase from 'corteza-webapp-compose/src/components/PageBlocks/RecordListBase'

export default {
  components: {
    RecordListBase,
  },

  data () {
    return {
      block: new compose.PageBlockRecordList(),
      page: new compose.Page(),
      boundingRect: {},
      namespace: this.$attrs.namespace,
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

    title () {
      return this.$t('module.allRecords.list.title', { name: this.module.name || '' })
    },

    module () {
      if (this.$attrs.moduleID) {
        return this.getModuleByID(this.$attrs.moduleID)
      } else {
        return undefined
      }
    },

  },

  created () {
    const options = {
      moduleID: this.$attrs.moduleID,
      fields: this.module.fields ? [...this.module.fields.sort((a, b) => a.label.localeCompare(b.label)).slice(0, 5)] : [],
      customFields: true,
      rowViewUrl: 'admin.modules.record.view',
      rowEditUrl: 'admin.modules.record.edit',
      hideRecordReminderButton: true,
      hideRecordViewButton: true,
      hideRecordCloneButton: true,
      allowExport: true,
    }
    this.block.options = options
  },

}
</script>
