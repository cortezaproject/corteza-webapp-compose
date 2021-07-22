<template>
  <div
    class="h-100 px-2"
  >
    <portal to="topbar-title">
      {{ title }}
    </portal>

    <portal to="topbar-tools">
      <b-button-group
        v-if="modulePage"
        size="sm"
        class="mr-1"
      >
        <b-button
          variant="primary"
          :disabled="!modulePage"
          :to="modulePage"
          style="margin-right:2px;"
          class="d-flex align-items-center"
        >
          {{ $t('module.edit.edit') }}
          <font-awesome-icon
            :icon="['fas', 'pen']"
            size="sm"
            class="ml-2"
          />
        </b-button>
      </b-button-group>
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

    modulePage () {
      if (this.module) {
        return { name: 'admin.modules.edit', params: { moduleID: this.module.moduleID }, query: null }
      }

      return undefined
    },
  },

  created () {
    const options = {
      moduleID: this.$attrs.moduleID,
      fields: this.module.fields ? [...this.module.fields.sort((a, b) => a.label.localeCompare(b.label)).slice(0, 5)] : [],
      customFields: true,
      rowViewUrl: 'admin.modules.record.view',
      rowEditUrl: 'admin.modules.record.edit',
      rowCreateUrl: 'admin.modules.record.create',
      hideRecordReminderButton: true,
      hideRecordViewButton: true,
      hideRecordCloneButton: true,
      allowExport: true,
    }
    this.block.options = options
  },

}
</script>
