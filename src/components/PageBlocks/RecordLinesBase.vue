<template>
  <wrap
    v-bind="$props"
    v-on="$listeners"
    :scrollable-body="false"
  >
    <template #toolbar>
      <b-container
        v-if="options.selectable"
        v-show="selected.length > 0"
        ref="header"
        class="m-0 p-0"
        fluid
      >
        <b-row
          no-gutters
          class="text-light bg-secondary p-2"
        >
          <b-col
            cols="4"
            class="pt-1 text-nowrap"
          >
            {{ $t('block.recordList.selected', { count: selected.length, total: records.length }) }}
            <a
              class="text-light"
              href="#"
              @click.prevent="handleSelectAllOnPage({ isChecked: false })"
            >
              ({{ $t('block.recordList.cancelSelection') }})
            </a>
          </b-col>
          <b-col
            class="text-right"
            cols="8"
          >
            <c-input-confirm
              @confirmed="handleDeleteSelectedRecords()"
              variant="link-light"
            />
          </b-col>
        </b-row>
      </b-container>
    </template>
    <template #default>
      <b-table
        ref="table"
        :small="false"
        :items="records"
        :fields="fields"
        :busy="processing"
        :selectable="options.selectable && inEditing"
        select-mode="multi"
        sticky-header
        responsive
        show-empty
        no-sort-reset
        class="mh-100 m-0 mb-2 border-top"
        @row-selected="handleRowSelected"
      >
        <template #head()="{ field }">
          {{ field.label }}
        </template>
        <template #cell()="{ item: r, field, index }">
          <field-editor
            v-if="field.moduleField.canUpdateRecordValue && field.edit"
            :field="field.moduleField"
            value-only
            :record="r"
            :module="module"
            :namespace="namespace"
            :errors="fieldErrors(field.moduleField.name, index)"
            class="mb-0"
          />
          <div
            v-else-if="field.moduleField.canReadRecordValue && !field.edit"
            class="mb-0 my-auto"
          >
            <field-viewer
              :field="field.moduleField"
              value-only
              :record="r"
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
        </template>
        <template #cell(actions)="{ item: r, index }">
          <div class="text-right">
            <c-input-confirm
              v-if="relatedModule.canDeleteRecord && !r.deletedAt"
              variant="link"
              size="md"
              class="show-when-hovered"
              @confirmed="handleDeleteRecord(r, index)"
            />
            <!-- Allow record restoration -->
            <b-btn
              v-else-if="r.deletedAt"
              variant="outline-primary"
              @click="restore(r, index)"
            >
              Restore
            </b-btn>
          </div>
        </template>
        <template #head(selectable)>
          <b-checkbox
            :disabled="records.length === 0"
            :checked="areAllRowsSelected"
            @change="handleSelectAllOnPage({ isChecked: $event })"
          />
        </template>
        <template #cell(selectable)="{ item, index, rowSelected }">
          <b-checkbox
            :checked="rowSelected"
            @change="handleRowSelectCheckbox({ record: item, index, isChecked: $event })"
          />
        </template>
        <template #table-busy>
          <div class="text-center m-5">
            <div>
              <b-spinner
                small
                class="align-middle m-2"
              />
            </div>
          </div>
        </template>
      </b-table>
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
import { compose, validator, NoID } from '@cortezaproject/corteza-js'

export default {
  components: {
    FieldViewer,
    FieldEditor,
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
      selected: [],
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

    /**
     * Check if all rows are selected
     */
    areAllRowsSelected () {
      if (this.selected.length > 0 && this.records.length > 0) {
        return this.selected.length === this.records.length
      }
      return false
    },

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

      const configured = [
        ...fieldsEdit,
        ...fieldsView,
      ]

      const pre = []
      const post = []

      if (this.options.selectable && this.inEditing) {
        pre.push({ key: 'selectable', label: '', tdClass: 'selector align-middle', thClass: 'selector' })
      }

      if (this.inEditing) {
        post.push({ key: 'actions', label: '', tdClass: 'actions align-middle' })
      }

      return [
        ...pre,
        ...configured,
        ...post,
      ]
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
        sort = `${positionField} DESC`
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

    handleSelectAllOnPage ({ isChecked }) {
      if (isChecked) {
        this.$refs.table.selectAllRows()
      } else {
        this.$refs.table.clearSelected()
      }
    },

    handleRowSelectCheckbox ({ index, isChecked }) {
      if (isChecked) {
        this.$refs.table.selectRow(index)
      } else {
        this.$refs.table.unselectRow(index)
      }
    },

    handleRowSelected (selected) {
      this.selected = selected
    },

    handleDeleteSelectedRecords () {
      if (this.selected.length === 0) {
        return
      }

      this.selected.forEach((r, i) => {
        const nr = new compose.Record(this.relatedModule, { ...r, deletedAt: new Date() })
        this.records.splice(i, 1, nr)
        this.selected.splice(i, 1, nr)
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
  },
}
</script>

<style lang="scss" scoped>
.b-table > tbody > tr:not(:hover) .show-when-hovered {
  visibility: hidden;
}
</style>
