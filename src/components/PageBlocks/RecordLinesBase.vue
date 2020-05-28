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
              v-if="inEditing"
              class="fit"
            />
            <b-th
              v-for="field in fields"
              :key="field.key"
              sticky-column
            >
              <span :class="{ required: field.required }">
                {{ field.label }}
              </span>
            </b-th>
            <b-th
              v-if="inEditing"
              class="fit"
            />
          </b-tr>
        </b-thead>
        <draggable
          v-if="records.length && !processing"
          :disabled="!inEditing"
          v-model="records"
          group="records"
          element="b-tbody"
          handle=".handle"
          @change="onChange"
        >
          <b-tr
            v-for="(record, index) in records"
            :key="`${index}${record.recordID}`"
            :variant="!!record.deletedAt ? 'danger' : undefined"
          >
            <b-td
              v-if="inEditing"
              class="align-top fit pr-0"
            >
              <font-awesome-icon
                v-b-tooltip.hover
                :icon="['fas', 'sort']"
                :title="$t('general.tooltip.dragAndDrop')"
                class="handle text-secondary mt-2"
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
                :errors="fieldErrors(field.moduleField.name, index)"
                class="mb-0"
              />
              <div
                v-else-if="field.moduleField.canReadRecordValue && !field.edit"
                class="mb-0 mt-2"
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
              class="text-right align-top fit pl-0"
            >
              <div
                class="mt-1"
              >
                <!-- Allow record restoration -->
                <b-btn
                  v-if="record.deletedAt"
                  variant="outline-primary"
                  @click="restore(record, index)"
                >
                  {{ $t('block.recordLines.restoreRecord') }}
                </b-btn>
                <c-input-confirm
                  v-else-if="relatedModule.canDeleteRecord"
                  variant="link"
                  size="md"
                  class="show-when-hovered"
                  @confirmed="handleDeleteRecord(record, index)"
                />
              </div>
            </b-td>
          </b-tr>
        </draggable>
        <b-tbody
          v-else-if="processing"
        >
          <b-tr>
            <b-td
              class="text-center align-top py-5"
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
      localErrors: new validator.Validated(),
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
      let { editFields, viewFields } = this.options
      if (editFields.length > 0) {
        editFields = this.relatedModule.filterFields(this.options.editFields).map(f => ({
          key: f.name,
          label: f.label || f.name,
          moduleField: f,
          edit: this.inEditing,
          required: f.isRequired,
          tdClass: 'record-value',
        }))
      }

      if (viewFields.length > 0) {
        viewFields = this.relatedModule.filterFields(this.options.viewFields).map(f => ({
          key: f.name,
          label: f.label || f.name,
          moduleField: f,
          edit: false,
          thClass: 'text-right',
          tdClass: 'record-value align-top text-right',
        }))
      }

      if (editFields.length === 0 && viewFields.length === 0) {
        viewFields = this.relatedModule.fields.filter(({ isSystem }) => !isSystem)
      }

      return [
        ...editFields,
        ...viewFields,
      ]
    },

    numOfFields () {
      let numOfFields = this.fields.length || 0

      if (this.inEditing) numOfFields += 2

      return numOfFields
    },
  },

  watch: {
    // we will keep a local copy of the errors, so we can manipulate it at will
    errors: {
      handler: function (v = { set: [] }) {
        this.localErrors = new validator.Validated(...v.set)
      },
      deep: true,
      immediate: true,
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
    onChange ({ moved }) {
      const { newIndex: ni, oldIndex: oi } = moved

      // stash away any errors that hapened on the affected item
      const a = this.localErrors.set.find(({ meta: { item } }) => item === oi)
      const ne = new validator.Validated(this.localErrors.set.find(({ meta: { item } }) => item !== oi))

      // shift/unshift other errors
      if (ni > oi) {
        // shift middle down
        for (const e of ne.set) {
          if (e.meta.item <= ni && e.meta.item > oi) {
            e.meta.item--
          }
        }
      } else {
        // shift middle up
        for (const e of ne.set) {
          if (e.meta.item >= ni && e.meta.item < oi) {
            e.meta.item++
          }
        }
      }

      // unstash affected item's error
      if (a) {
        a.meta.item = ni
        ne.push(a)
      }

      this.localErrors = ne
    },

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
        // Record lines should display a relatively small number, so we can just ignore pagination
        perPage: 0,
      }
    },

    resolveRecords (resolve) {
      resolve({
        records: this.records,
        module: this.relatedModule,
        refField: this.options.parentField,
        posField: this.options.positionField,
      })
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

      // adition shifts items down
      for (const r of this.localErrors.set) {
        r.meta.item++
      }
      this.localErrors = new validator.Validated(...this.localErrors.set)
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
      if (!this.localErrors) {
        return new validator.Validated()
      }

      return this.localErrors
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
        errors: this.localErrors,
        validator: this.validator,
      }

      return this
        .$EventBus
        .Dispatch(compose.RecordEvent(
          this.record, { eventType, resourceType, args }))
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

th .required::before {
  content: "*";
  display: inline-block;
  color: $primary;
  vertical-align: sub;
  margin-left: -10px;
  width: 10px;
  height: 16px;
  overflow: hidden;
}
</style>
