<template>
  <wrap
    v-bind="$props"
    v-on="$listeners"
    :scrollable-body="false"
  >
    <template #default>
      <b-table-simple
        sticky-header
        responsive
        class="mh-100 m-0 mb-2 border-top"
      >
        <b-thead>
          <b-tr>
            <b-th
              v-if="canReposition"
              class="fit"
            />
            <b-th
              v-for="field in fields"
              :key="field.key"
              sticky-column
            >
              {{ field.label }}
            </b-th>
            <b-th
              v-if="inEditing"
              class="fit"
            />
          </b-tr>
        </b-thead>
        <draggable
          v-if="records.length && !processing"
          :disabled="!canReposition"
          v-model="records"
          group="records"
          element="b-tbody"
          handle=".handle"
          @change="onDrop"
        >
          <b-tr
            v-for="(record, index) in records"
            :key="`${index}${record.recordID}`"
          >
            <b-td
              v-if="canReposition"
              class="align-middle fit pr-0"
            >
              <font-awesome-icon
                v-if="record.createdAt"
                v-b-tooltip.hover
                :icon="['fas', 'sort']"
                :title="$t('general.tooltip.dragAndDrop')"
                class="handle text-secondary"
              />
            </b-td>
            <b-td
              v-for="field in fields"
              :key="field.key"
            >
              <field-editor
                v-if="field.moduleField.canUpdateRecordValue && field.edit"
                :field="field.moduleField"
                value-only
                :record="record"
                :module="module"
                :namespace="namespace"
                :errors="fieldErrors(field.moduleField.name)"
                class="mb-0"
              />
              <div
                v-else-if="field.moduleField.canReadRecordValue && !field.edit"
                class="mb-0 my-auto"
              >
                <field-viewer
                  :field="field.moduleField"
                  value-only
                  :record="record"
                  :module="module"
                  :namespace="namespace"
                />
              </div>
              <i
                v-else
                class="text-secondary"
              >
                {{ $t('field.noPermission') }}
              </i>
            </b-td>
            <b-td
              v-if="inEditing"
              class="text-right align-middle fit pl-0"
            >
              <!-- Allow record restoration -->
              <b-btn
                v-if="record.deletedAt"
                variant="outline-primary"
                @click="restore(record, index)"
              >
                Restore
              </b-btn>
              <c-input-confirm
                v-else-if="relatedModule.canDeleteRecord"
                variant="link"
                size="md"
                class="show-when-hovered"
                @confirmed="handleDeleteRecord(record, index)"
              />
            </b-td>
          </b-tr>
        </draggable>
        <b-tbody
          v-else-if="processing"
        >
          <b-tr>
            <b-td
              class="text-center align-middle py-5"
              :colspan="numOfFields"
            >
              <b-spinner />
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </template>
    <template #footer>
      <b-container
        v-if="inEditing"
        ref="footer"
        fluid
        class="m-0 p-2"
      >
        <b-row
          no-gutters
        >
          <b-col>
            <b-button
              variant="outline-primary"
              class="float-left"
              @click="handleAddRecord()"
            >
              + {{ $t('block.recordList.addRecord') }}
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </wrap>
</template>

<script>
import base from './base'
import { mapGetters } from 'vuex'
import FieldViewer from 'corteza-webapp-compose/src/components/ModuleFields/Viewer'
import FieldEditor from 'corteza-webapp-compose/src/components/ModuleFields/Editor'
import users from 'corteza-webapp-compose/src/mixins/users'
import draggable from 'vuedraggable'
import { compose, validator, NoID } from '@cortezaproject/corteza-js'

export default {
  components: {
    FieldViewer,
    FieldEditor,
    draggable,
  },

  extends: base,

  mixins: [
    users,
  ],

  props: {
    errors: {
      type: validator.Validated,
      required: false,
    },
  },

  data () {
    return {
      inEditing: false,
      processing: false,
      filter: {},
      records: [],
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

    relatedModule () {
      if (this.options.moduleID) {
        return this.getModuleByID(this.options.moduleID)
      } else {
        return undefined
      }
    },

    fields () {
      let { fieldsEdit, fieldsView } = this.options
      if (fieldsEdit.length > 0) {
        fieldsEdit = this.relatedModule.filterFields(this.options.fieldsEdit).map(f => ({
          key: f.name,
          label: f.label || f.name,
          moduleField: f,
          edit: this.inEditing,
          tdClass: 'record-value',
        }))
      }

      if (fieldsView.length > 0) {
        fieldsView = this.relatedModule.filterFields(this.options.fieldsView).map(f => ({
          key: f.name,
          label: f.label || f.name,
          moduleField: f,
          edit: false,
          thClass: 'text-right',
          tdClass: 'record-value align-middle text-right',
        }))
      }

      if (fieldsEdit.length === 0 && fieldsView.length === 0) {
        fieldsView = this.relatedModule.fields.filter(({ isSystem }) => !isSystem)
      }

      return [
        ...fieldsEdit,
        ...fieldsView,
      ]
    },

    canReposition () {
      return this.inEditing && !!this.options.positionField
    },

    numOfFields () {
      let numOfFields = this.fields.length || 0

      if (this.inEditing) numOfFields++
      if (this.canReposition) numOfFields++

      return numOfFields
    },
  },

  beforeDestroy () {
    this.$root.$off(`record-line:collect:${this.blockIndex}`)
  },

  created () {
    this.$root.$on(`record-line:collect:${this.blockIndex}`, this.resolveRecords)
    this.prep()
    this.getRecords()
  },

  methods: {
    prep () {
      const { moduleID, parentField, positionField } = this.options

      // Validate props
      if (!moduleID) {
        throw Error(this.$t('notification.record.moduleOrPageNotSet'))
      }

      let filter = ''
      if (parentField && this.record.recordID) {
        filter = `${parentField} = ${this.record.recordID}`
      }

      let sort = 'createdAt DESC'
      if (positionField) {
        sort = `${positionField}`
      }

      this.filter = {
        sort: sort,
        filter: filter,
      }
    },

    resolveRecords (resolve) {
      resolve({
        records: this.records,
        module: this.relatedModule,
        refField: this.options.parentField,
      })
    },

    onDrop ({ moved, ...foo }) {
      if (moved) {
        const { element, newIndex } = moved
        this.moveRecord(
          element,
          this.calcNewPosition(element, newIndex),
        )
      }
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
      return parseInt(this.records[newPosition - 1].values[this.options.positionField] || 0) + 1
    },

    handleDeleteRecord (record, i) {
      this.records.splice(i, 1, new compose.Record(this.relatedModule, { ...record, deletedAt: new Date() }))
    },

    restore (record, i) {
      this.records.splice(i, 1, new compose.Record(this.relatedModule, { ...record, deletedAt: undefined }))
    },

    handleAddRecord () {
      const newRecord = new compose.Record({ recordID: NoID }, this.relatedModule)
      this.records.splice(0, 0, newRecord)
    },

    /**
     * Loader for b-table
     *
     * Will ignore b-tables input arguments for filter
     * and assemble them on our own
     */
    getRecords () {
      this.processing = true
      this.records = []

      if (this.relatedModule.moduleID !== this.options.moduleID) {
        this.processing = false
        throw Error('Module incompatible, module mismatch')
      }

      this.$ComposeAPI.recordList({ ...this.relatedModule, ...this.filter })
        .then(({ set, filter }) => {
          const records = set.map(r => Object.freeze(new compose.Record(r, this.relatedModule)))

          this.filter = { ...this.filter, ...filter }

          // Extract user IDs from record values and load all users
          const fields = this.fields.filter(f => f.moduleField).map(f => f.moduleField)
          this.fetchUsers(fields, records)

          this.records = records
          this.processing = false
        })
        .catch(err => {
          this.processing = false
          console.error(err)
        })
    },

    fieldErrors (name, index) {
      if (!this.errors) {
        return new validator.Validated()
      }

      return this.errors
        .filterByMeta('field', name)
        .filterByMeta('resource', this.relatedModule.resourceID)
        .filterByMeta('item', index)
    },

    /**
     * Generic event dispatcher for ui:compose:record-page resource type
     *
     * This is used when deleting, updating, creating
     * records and where validation errors occur
     *
     * @param eventType
     */
    dispatchUiEvent (eventType) {
      const resourceType = `ui:compose:${this.getUiEventResourceType || 'record-page'}`

      const args = {
        errors: this.errors,
        validator: this.validator,
      }

      return this
        .$EventBus
        .Dispatch(compose.RecordEvent(
          this.record, { eventType, resourceType, args }))
    },

    /**
     * Reposition record
     *
     * This is only a helper function and we do not keep any hard dependencies on
     * the API client.
     *
     * @param {Record}            record,     Record we're moving
     * @param {Number}            position    New position
     * @returns {Promise<void>}
     */
    async moveRecord (record, position) {
      const { namespaceID, moduleID, recordID } = record

      if (moduleID !== this.options.moduleID) {
        throw Error('Record incompatible, module mismatch')
      }

      const { positionField } = this.options
      const args = {
        recordID,
        positionField,
        position,
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
  },
}
</script>

<style lang="scss" scoped>
.table td.fit,
.table th.fit {
  white-space: nowrap;
  width: 1%;
}

.b-table > tbody > tr:not(:hover) .show-when-hovered {
  visibility: hidden;
}

.handle {
  cursor: grab;
}
</style>
