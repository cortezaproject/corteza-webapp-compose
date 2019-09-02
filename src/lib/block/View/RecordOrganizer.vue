<template>
  <div class="h-100">
    <i v-if="!recordOrganizerModule.canReadRecord" class="text-secondary">{{ $t('block.recordList.record.noPermission') }}</i>
    <div v-else class="h-100">
      <i v-if="!records.length" class="text-secondary">{{ $t('block.recordOrganizer.noRecords') }}</i>
      <draggable v-model="records"
                :disabled="!recordOrganizerModule.canUpdateRecord"
                :group="{ name: getModuleID, put: checkDrop() }"
                :class="{ 'organizer': true, 'empty': !records.length }"
                @change="setSettingValue">

        <b-card v-for="(record, index) in records"
                :key="record.recordID"
                :class="{ 'mb-2': true, 'grab': recordOrganizerModule.canUpdateRecord }"
                border-variant="primary">

          <b-card-title>
            <field-viewer v-if="getTitleField(index).canReadRecordValue" :field="getTitleField(index)" :record="record" :namespace="namespace" valueOnly />
            <i v-else class="text-secondary h">{{ $t('field.noPermission') }}</i>
          </b-card-title>
          <b-card-text>
            <field-viewer v-if="getDescriptionField(index).canReadRecordValue" :field="getDescriptionField(index)" :record="record" :namespace="namespace" valueOnly/>
            <i v-else class="text-secondary h6">{{ $t('field.noPermission') }}</i>
          </b-card-text>
        </b-card>
      </draggable>
      <b-button @click.prevent="createNewRecord()"
                :disabled="!recordOrganizerModule.canCreateRecord"
                size="sm"
                variant="outline-primary"
                class="mt-2">
        + {{ $t('block.recordList.addRecord') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import base from './base'
import draggable from 'vuedraggable'
import FieldViewer from 'corteza-webapp-compose/src/lib/field/Viewer'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'

export default {
  components: {
    FieldViewer,
    draggable,
  },

  extends: base,

  data () {
    return {
      filter: {
        sort: '',
        filter: '',
      },

      records: [],
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
      pages: 'page/set',
    }),

    recordOrganizerModule () {
      return this.getModuleByID(this.options.moduleID)
    },

    getModuleID () {
      return this.options.moduleID
    },
  },

  beforeMount () {
    if (!this.options.moduleID) {
      // Make sure block is properly configured
      throw Error(this.$t('notification.record.moduleOrPageNotSet'))
    }

    /* eslint-disable no-template-curly-in-string */
    if (!this.record) {
      // If there is no current record and we are using recordID/ownerID variable in (pre)filter
      // we should disable the block
      if ((this.options.prefilter || '').includes('${record')) {
        throw Error(this.$t('notification.record.invalidRecordVar'))
      }

      if ((this.options.prefilter || '').includes('${ownerID}')) {
        throw Error(this.$t('notification.record.invalidOwnerVar'))
      }
    }

    this.filter.sort = this.options.presortField
    this.filter.filter = this.options.prefilter

    if (this.options.prefilter) {
      // Little magic here: prefilter is wraped with backticks and evaluated
      // this allows us to us ${record.values....}, ${recordID}, ${ownerID}, ${userID} in prefilter string;
      // hence the /hanging/ record, recordID, ownerID and userID variables
      this.prefilter = (function (prefilter, { record, recordID, ownerID, userID }) {
        /* eslint-disable no-eval */
        return eval('`' + prefilter + '`')
      })(this.options.prefilter, {
        record: this.record,
        recordID: (this.record || {}).recordID || 0,
        ownerID: (this.record || {}).userID || 0,
        userID: (this.$auth.user || {}).userID || 0,
      })

      this.filter.filter = this.prefilter
    }

    if (this.recordOrganizerModule) {
      this.fetch()
    }
  },

  methods: {
    getTitleField (index) {
      const { labelField } = this.options
      return this.recordOrganizerModule.fields.find(f => f.name === labelField)
    },

    getDescriptionField (index) {
      const { descriptionField } = this.options
      return this.recordOrganizerModule.fields.find(f => f.name === descriptionField)
    },

    checkDrop () {
      const { settingField } = this.options
      return this.recordOrganizerModule.fields.find(f => f.name === settingField).canUpdateRecordValue
    },

    setSettingValue ({ added }) {
      if (added) {
        const record = added.element
        const { settingField, settingValue } = this.options
        record.values[settingField] = settingValue
        const { namespaceID, moduleID, recordID, values } = record
        this.$ComposeAPI.recordUpdate({ namespaceID, moduleID, recordID, values }).then(record => {
          this.fetch()
        })
      }
    },

    reorderRecords (event) {
      // console.log(event)
    },

    createNewRecord () {
      const { moduleID, settingField, settingValue } = this.options
      const recordPageID = this.pages.find(p => p.moduleID === moduleID).pageID
      let values = {}
      values[settingField] = settingValue
      this.$router.push({ name: 'page.record.create', params: { pageID: recordPageID, values: values } })
    },

    fetch (params = this.filter) {
      params.moduleID = this.options.moduleID
      params.namespaceID = this.namespace.namespaceID

      return this.$ComposeAPI.recordList(params).then(({ filter, set }) => {
        this.records = set.map(r => new Record(this.recordOrganizerModule, r))
      }).catch(this.defaultErrorHandler(this.$t('notification.record.listLoadFailed')))
    },
  },
}
</script>

<style lang="scss" scoped>
.grab {
  cursor: grab;
}

.organizer {
  overflow-y: auto;
  height: calc(100% - 30px);
}

.empty {
  height: calc(100% - 70px);
}
</style>
