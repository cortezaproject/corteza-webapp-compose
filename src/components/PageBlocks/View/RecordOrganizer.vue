<template>
  <div class="h-100">
    <i v-if="!isConfigured" class="text-secondary d-block">{{ $t('block.recordOrganizer.notConfigured') }}</i>
    <i v-else-if="!roModule.canReadRecord" class="text-secondary d-block">{{ $t('block.recordList.record.noPermission') }}</i>
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
                     :to="{ name: 'page.record', params: { pageID: roRecordPage.pageID, recordID: record.recordID }, query: null }"
                     border-variant="primary">

          <b-card-title v-if="titleField">
            <field-viewer v-if="titleField.canReadRecordValue"
                          :field="titleField"
                          :record="record"
                          :namespace="namespace" valueOnly />
            <i v-else class="text-secondary h6">{{ $t('field.noPermission') }}</i>
          </b-card-title>
          <b-card-text v-if="descriptionField">
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
import users from 'corteza-webapp-compose/src/mixins/users'
import { compose } from '@cortezaproject/corteza-js'

export default {
  components: {
    FieldViewer,
    draggable,
  },

  extends: base,

  mixins: [
    users,
  ],

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
        return undefined
      }

      return this.roModule.fields.find(f => f.name === labelField) || {}
    },

    descriptionField () {
      const { descriptionField } = this.options

      if (!descriptionField) {
        return undefined
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
      if (this.positionField.fieldID) {
        return this.roModule.canUpdateRecord && this.positionField.canUpdateRecordValue
      } else {
        return !!this.roModule.canUpdateRecord
      }
    },

    canAddRecord () {
      return this.roModule.canCreateRecord && this.roRecordPage
    },

    isConfigured () {
      return !!(this.titleField || this.descriptionField)
    },
  },

  beforeMount () {
    if (!this.ro.moduleID) {
      // Make sure block is properly configured
      throw Error(this.$t('notification.record.moduleOrPageNotSet'))
    }

    if (this.roModule) {
      this.fetchRecords(this.$ComposeAPI, this.roModule, this.expandFilter()).then(rr => {
        this.records = rr
        const fields = [this.titleField, this.descriptionField]
        this.fetchUsers(fields, this.records)
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
      this.moveRecord(
        record,
        this.calcNewPosition(record, newIndex),
        this.ro.group,
      )
    },

    reposition ({ element: record, newIndex }) {
      // Move record to a different position in the same group
      this.moveRecord(
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

      const total = this.records.length
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

      const { pageID } = this.roRecordPage

      const values = {}
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

    /**
     * Reposition and optionally move record to a different group
     *
     * This is only a helper function and we do not keep any hard dependencies on
     * the API client.
     *
     * @param {Compose}           api Compose API client
     * @param {Record}            record,     Record we're moving
     * @param {Number}            position    New position
     * @param {String|undefined}  group       New group
     * @returns {Promise<void>}
     */
    async moveRecord (record, position, group) {
      const { namespaceID, moduleID, recordID } = record

      if (moduleID !== this.options.moduleID) {
        throw Error('Record incompatible, module mismatch')
      }

      const { filter, positionField, groupField } = this.options
      const args = {
        recordID,
        filter,
        positionField,
        position,
      }

      if (group !== undefined) {
        // If group is set (empty string is a valid!
        args.groupField = groupField
        args.group = group || ''
      }

      const params = {
        procedure: 'organize',
        namespaceID,
        moduleID,
        // map kv to [{ name: k, value: v }, ...]
        args: Object.keys(args).map(name => ({ name, value: String(args[name]) })),
      }

      return this.$ComposeAPI.recordExec(params)
    },

    /**
     * Fetches group of records using configured options & module
     *
     * @param {Compose}           api Compose API client
     * @param {Module}            module Module to use for assembling API request & casting results
     * @param {String}            filter Filter records
     * @returns {Promise<Record[]>}
     */
    async fetchRecords (module, filter) {
      if (module.moduleID !== this.options.moduleID) {
        throw Error('Module incompatible, module mismatch')
      }

      const { positionField: sort } = this.options
      const { moduleID, namespaceID } = module

      const params = {
        namespaceID,
        moduleID,
        filter,
        sort,
      }

      return this.$ComposeAPI
        .recordList(params)
        .then(({ set }) => set.map(r => Object.freeze(new compose.Record(module, r))))
    },
  },
}
</script>

<style lang="scss" scoped>
.grab {
  cursor: grab;
}
</style>
