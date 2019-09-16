<template>
  <div class="h-100">
    <i v-if="!roModule.canReadRecord" class="text-secondary d-block">{{ $t('block.recordList.record.noPermission') }}</i>
    <div v-else class="h-100 mb-5">
      <i v-if="!records.length" class="text-secondary d-block">{{ $t('block.recordOrganizer.noRecords') }}</i>
      <draggable v-model="records"
                :disabled="!canReposition"
                :group="{ name: moduleID, put: canReposition }"
                class="h-100"
                @change="onDrop">

        <router-link tag="b-card"
                     v-for="record in records"
                     :key="record.recordID"
                     :class="{ 'mb-2': true, 'grab': canReposition }"
                     :to="{ name: 'page.record', params: { pageID: options.pageID, recordID: record.recordID }, query: null }"
                     border-variant="primary">
          <b-card-title>
            <field-viewer v-if="titleField.canReadRecordValue"
                          :field="titleField"
                          :record="record"
                          :namespace="namespace" valueOnly />
            <i v-else class="text-secondary h6">{{ $t('field.noPermission') }}</i>
          </b-card-title>
          <b-card-text>
            <field-viewer v-if="descriptionField.canReadRecordValue"
                          :field="descriptionField"
                          :record="record"
                          :namespace="namespace" valueOnly/>
            <i v-else class="text-secondary h6">{{ $t('field.noPermission') }}</i>
          </b-card-text>
        </router-link>
      </draggable>
      <b-card-footer footer-bg-variant="white"
                     class="fixed-bottom">
        <b-button @click.prevent="createNewRecord"
                  :disabled="!canAddRecord"
                  size="sm"
                  variant="outline-primary">
          + {{ $t('block.recordList.addRecord') }}
        </b-button>
      </b-card-footer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import base from './base'
import draggable from 'vuedraggable'
import FieldViewer from 'corteza-webapp-compose/src/lib/field/Viewer'
import { RecordOrganizer } from '../RecordOrganizer'

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

    ro () {
      return new RecordOrganizer(this.options)
    },

    roModule () {
      return this.getModuleByID(this.moduleID)
    },

    roRecordPage () {
      return this.pages.find(p => p.moduleID === this.moduleID)
    },

    moduleID () {
      return this.ro.moduleID
    },

    titleField () {
      const { labelField } = this.options

      if (!labelField) {
        return {}
      }

      return this.roModule.fields.find(f => f.name === labelField) || {}
    },

    descriptionField () {
      const { descriptionField } = this.options

      if (!descriptionField) {
        return {}
      }

      return this.roModule.fields.find(f => f.name === descriptionField) || {}
    },

    positionField () {
      const { positionField } = this.options

      if (!positionField) {
        return {}
      }

      return this.roModule.fields.find(f => f.name === positionField) || {}
    },

    canReposition () {
      return this.roModule.canUpdateRecord && this.positionField.canUpdateRecordValue
    },

    canAddRecord () {
      return this.roModule.canCreateRecord && this.roRecordPage
    },
  },

  beforeMount () {
    if (!this.ro.moduleID) {
      // Make sure block is properly configured
      throw Error(this.$t('notification.record.moduleOrPageNotSet'))
    }

    if (this.roModule) {
      this.ro.fetchRecords(this.$ComposeAPI, this.roModule, this.expandFilter()).then(rr => {
        this.records = rr
      })
    }
  },

  methods: {
    onDrop ({ added, moved, ...foo }) {
      if (added) {
        this.reorganize(added)
      } else if (moved) {
        this.reposition(moved)
      }
    },

    reorganize ({ element: record, newIndex }) {
      // Move record to a different position in a different group
      this.ro.moveRecord(
        this.$ComposeAPI,
        record,
        this.calcNewPosition(record, newIndex),
        this.ro.group,
      )
    },

    reposition ({ element: record, newIndex }) {
      // Move record to a different position in the same group
      this.ro.moveRecord(
        this.$ComposeAPI,
        record,
        this.calcNewPosition(record, newIndex),
      )
    },

    /**
     * Calculates optimal position value for dropped record
     */
    calcNewPosition (record, newPosition = 0) {
      if (newPosition <= 0) {
        // Dropped in first place, easy-breezy
        return 0
      }

      let total = this.records.length
      if (newPosition > total) {
        // Dropped at the end,
        // make sure we don't put it too far away
        return total
      }

      // Find position field on the record placed before the drop position
      // fallback to 1
      return parseInt(this.records[newPosition - 1].values[this.ro.positionField] || 0) + 1
    },

    createNewRecord () {
      const { positionField, groupField } = this.options

      console.log(this.roRecordPage)
      if (!this.roRecordPage) {
        // can not create record without a record page
        return
      }

      let { pageID } = this.roRecordPage

      let values = {}
      values[positionField] = groupField
      this.$router.push({ name: 'page.record.create', params: { pageID, values: values } })
    },

    expandFilter () {
      /* eslint-disable no-template-curly-in-string */
      if (!this.record) {
        // If there is no current record and we are using recordID/ownerID variable in (pre)filter
        // we should disable the block
        if ((this.ro.filter || '').includes('${record')) {
          throw Error(this.$t('notification.record.invalidRecordVar'))
        }

        if ((this.ro.filter || '').includes('${ownerID}')) {
          throw Error(this.$t('notification.record.invalidOwnerVar'))
        }
      }

      if (this.ro.filter) {
        // Little magic here: filter is wraped with backticks and evaluated
        // this allows us to us ${record.values....}, ${recordID}, ${ownerID}, ${userID} in filter string;
        // hence the /hanging/ record, recordID, ownerID and userID variables
        return (function (filter, { record, recordID, ownerID, userID }) {
          /* eslint-disable no-eval */
          return eval('`' + filter + '`')
        })(this.ro.filter, {
          record: this.record,
          recordID: (this.record || {}).recordID || 0,
          ownerID: (this.record || {}).userID || 0,
          userID: (this.$auth.user || {}).userID || 0,
        })
      }

      return ''
    },
  },
}
</script>

<style lang="scss" scoped>
.grab {
  cursor: grab;
}
</style>
