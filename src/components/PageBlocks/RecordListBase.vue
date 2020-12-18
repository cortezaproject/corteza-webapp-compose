<template>
  <wrap v-bind="$props" v-on="$listeners" :scrollable-body="false">
    <template
      v-if="showHeader"
      #header
    >
      <div
        class="w-100"
      >
        {{ block.title }}
        <h4
          class="d-inline-block mb-0"
        >
          <b-badge
            v-if="Object.keys(recordListModule.labels || {}).includes('federation')"
            variant="primary"
            style="border-radius: 0.5rem;"
            class="py-1"
          >
            {{ $t('block.recordList.federated') }}
          </b-badge>
        </h4>
      </div>
    </template>
    <template #toolbar>
      <b-container
        ref="toolbar"
        class="m-0 p-2"
        fluid
      >
        <b-row
          no-gutters
          class="m-0 p-0"
        >
         <b-col
            cols="6"
          >
            <template v-if="!options.hideAddButton && recordListModule.canCreateRecord">
              <template v-if="inlineEditing">
                  <b-btn
                    variant="outline-primary"
                    class="btn btn-sm btn-outline-primary float-left"
                    @click="addInline"
                  >
                    + {{ $t('block.recordList.addRecord') }}
                  </b-btn>
              </template>

              <template v-else-if="!inlineEditing && recordPageID">
                <router-link
                  class="btn btn-sm btn-outline-primary float-left"
                  :to="{
                    name: 'page.record.create',
                    params: { pageID: recordPageID, refRecord: record },
                    query: null,
                  }"
                >
                  + {{ $t('block.recordList.addRecord') }}
                </router-link>
                <importer-modal
                  :module="recordListModule"
                  :namespace="namespace"
                  class="ml-1 float-left"
                />
              </template>
            </template>

            <exporter-modal
              v-if="options.allowExport && !inlineEditing"
              :module="recordListModule"
              :record-count="items.length"
              :query="query"
              :selection="selected"
              @export="onExport"
              class="ml-1 float-left"
            />
          </b-col>
          <b-col
            cols="6"
          >
            <b-input
              v-if="!options.hideSearch && !inlineEditing"
              v-model="query"
              class="float-right mw-100"
              size="sm"
              type="search"
              :placeholder="$t('general.label.search')" />

          </b-col>
        </b-row>
        <b-row
          v-if="options.selectable"
          v-show="selected.length > 0"
          class="text-light bg-secondary p-2 mt-2"
        >
          <b-col
            cols="4"
            class="pt-1 text-nowrap"
          >
            {{ $t('block.recordList.selected', { count: selected.length, total: items.length }) }}
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
            <automation-buttons
              class="d-inline m-0"
              :buttons="options.selectionButtons"
              :module="recordListModule"
              :extra-event-args="{ selected, filter }"
              v-bind="$props"
              @refresh="refresh()"
            />
            <c-input-confirm
              v-if="!inlineEditing"
              @confirmed="handleDeleteSelectedRecords()"
              variant="link-light"
            />
            <b-button
              v-else-if="!areAllRowsDeleted"
              variant="link"
              size="md"
              class="border-0 text-dark"
              @click.prevent="handleDeleteSelectedRecords()"
            >
              <font-awesome-icon
                :icon="['far', 'trash-alt']"
              />
            </b-button>
            <b-button
              v-else
              variant="link"
              size="md"
              class="border-0 text-dark"
              @click.prevent="handleRestoreSelectedRecords()"
            >
              <font-awesome-icon
                :icon="['fa', 'trash-restore']"
              />
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </template>
    <template #default>
      <b-table-simple
        hover
        responsive
        sticky-header
        class="mh-100 m-0 mb-2 border-top"
      >

      <b-thead>
        <b-tr>
          <b-th v-if="options.draggable && inlineEditing" />
          <b-th v-if="options.selectable">
            <b-checkbox
              :disabled="disableSelectAll"
              :checked="areAllRowsSelected && !disableSelectAll"
              @change="handleSelectAllOnPage({ isChecked: $event })"
            />
          </b-th>
          <b-th />

          <b-th
            v-for="field in fields"
            :key="field.key"
            sticky-column
            @click="handleSort(field)"
            class="pr-0"
            :style="{
              cursor: field.sortable ? 'pointer' : 'default',
            }"
          >
            <div
              class="d-flex justify-content-between align-self-center"
            >
              <div
                :class="{ required: field.required }"
                class="d-flex align-self-center text-nowrap"
              >
                {{ field.label }}
              </div>
              <b-btn
                v-if="field.sortable"
                variant="link p-0 ml-1"
              >
                <font-awesome-layers>
                  <font-awesome-icon
                    :icon="['fas', 'sort-up']"
                    :style="{
                      color: 'gray',
                      ...sorterStyle(field, 'ASC'),
                    }"
                  />
                  <font-awesome-icon
                    :icon="['fas', 'sort-down']"
                    :style="{
                      color: 'gray',
                      ...sorterStyle(field, 'DESC'),
                    }"
                  />
                </font-awesome-layers>
              </b-btn>
            </div>
          </b-th>

          <b-th />
        </b-tr>
      </b-thead>

      <draggable
        v-if="items.length && !processing"
        :disabled="!inlineEditing || !options.draggable"
        v-model="items"
        group="items"
        tag="b-tbody"
        handle=".handle"
      >
        <b-tr
          v-for="(item, index) in items"
          :key="`${index}${item.r.recordID}`"
          :variant="!!item.r.deletedAt ? 'danger' : undefined"
          :class="{ 'pointer': !(options.editable && editing) }"
          @click="handleRowClicked(item)"
        >
          <b-td
            v-if="options.draggable && inlineEditing"
            class="align-top pr-0"
            @click.stop
          >
            <font-awesome-icon
              v-b-tooltip.hover
              :icon="['fas', 'sort']"
              :title="$t('general.tooltip.dragAndDrop')"
              class="handle text-secondary sort-adjust-offset"
            />
          </b-td>

          <b-td
            v-if="options.selectable"
            class="align-top pr-0"
            @click.stop
          >
            <b-form-checkbox
              class="checkbox-adjust-offset"
              :checked="selected.includes(item.id)"
              @change="onSelectRow($event, item)"
            />
          </b-td>

          <b-td>
            <b-badge
              v-if="Object.keys(item.r.labels || {}).includes('federation')"
              variant="primary"
            >
              F
            </b-badge>
          </b-td>

          <b-td
            v-for="field in fields"
            :key="field.key"
          >
            <field-editor
              v-if="field.moduleField.canUpdateRecordValue && field.editable"
              :field="field.moduleField"
              value-only
              :record="item.r"
              :module="module"
              :namespace="namespace"
              :errors="recordErrors(item, field)"
              inline-editor
              class="mb-0"
              @click.stop
            />
            <div
              v-else-if="field.moduleField.canReadRecordValue && !field.edit"
              class="mb-0"
              :class="{
                'field-adjust-offset': inlineEditing,
              }"
            >
              <field-viewer
                :field="field.moduleField"
                value-only
                :record="item.r"
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
            class="text-right align-top pl-0"
            @click.stop
          >
            <template v-if="inlineEditing">
              <b-button
                v-if="item.r.deletedAt"
                variant="link"
                size="md"
                class="border-0 text-dark mt-1"
                @click.prevent="handleRestoreInline(item, index)"
              >
                <font-awesome-icon
                  :icon="['fa', 'trash-restore']"
                />
              </b-button>
              <!-- The user should be able to delete the record if it's not yet saved -->
              <b-button
                v-else-if="recordListModule.canDeleteRecord || !item.r.deletedAt"
                variant="link"
                size="md"
                class="border-0 show-when-hovered text-danger mt-1"
                @click.prevent="handleDeleteInline(item, index)"
              >
                <font-awesome-icon
                  :icon="['far', 'trash-alt']"
                />
              </b-button>
            </template>

            <b-button
              v-if="!inlineEditing && !options.hideRecordReminderButton"
              variant="link"
              class="p-0 m-0 pl-1 text-secondary"
              @click.prevent="createReminder(item.r)">
              <font-awesome-icon
                :icon="['far', 'bell']"
              />
            </b-button>

            <template v-if="!options.hideRecordCloneButton && recordListModule.canCreateRecord && recordPageID">
              <b-button
                v-if="!inlineEditing"
                variant="link"
                class="p-0 m-0 pl-1 text-secondary"
                :to="{ name: 'page.record.create', params: { pageID: recordPageID, values: item.r.values }, query: null }"
              >
                <font-awesome-icon
                  :icon="['far', 'clone']"
                />
              </b-button>
              <b-button
                v-else
                variant="link"
                class="p-0 m-0 pl-1 text-secondary"
                @click="handleCloneInline(item.r)"
              >
                <font-awesome-icon
                  :icon="['far', 'clone']"
                />
              </b-button>
            </template>

            <template v-if="!inlineEditing">
              <b-button
                v-if="!options.hideRecordEditButton && recordListModule.canUpdateRecord && recordPageID"
                variant="link"
                class="p-0 m-0 pl-1 text-secondary"
                :to="{ name: 'page.record.edit', params: { pageID: recordPageID, recordID: item.r.recordID }, query: null }"
              >
                <font-awesome-icon
                  :icon="['far', 'edit']"
                />
              </b-button>
              <b-button
                v-if="!options.hideRecordViewButton && recordPageID"
                variant="link"
                class="p-0 m-0 pl-1 text-secondary"
                :to="{ name: 'page.record', params: { pageID: recordPageID, recordID: item.r.recordID }, query: null }"
              >
                <font-awesome-icon
                  :icon="['far', 'eye']"
                />
              </b-button>
            </template>
          </b-td>
        </b-tr>
      </draggable>
      <b-tbody
        v-else-if="processing"
      >
        <b-tr>
          <b-td
            class="text-center align-top py-5"
            :colspan="loaderCollSpan"
          >
            <b-spinner />
          </b-td>
        </b-tr>
      </b-tbody>
      </b-table-simple>
    </template>

    <template
      v-if="showFooter"
      #footer
    >
      <b-container
        ref="footer"
        fluid
        class="m-0 p-2"
      >
        <b-row
          no-gutters
        >
          <b-col>
            <b-button-group
              size="sm"
              class="float-right"
            >
              <b-button
                size="sm"
                variant="outline-primary"
                :disabled="!hasPrevPage"
                @click="goToPage()"
              >
                {{ $t('block.recordList.pagination.first') }}
              </b-button>
              <b-button
                variant="primary"
                :disabled="!hasPrevPage"
                @click="goToPage('prevPage')"
              >
                {{ $t('block.recordList.pagination.prev') }}
              </b-button>
              <b-button
                variant="primary"
                :disabled="!hasNextPage"
                @click="goToPage('nextPage')"
              >
                {{ $t('block.recordList.pagination.next') }}
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </wrap>
</template>
<script>
import { throttle } from 'lodash'
import { mapGetters } from 'vuex'
import base from './base'
import FieldViewer from 'corteza-webapp-compose/src/components/ModuleFields/Viewer'
import FieldEditor from 'corteza-webapp-compose/src/components/ModuleFields/Editor'
import ExporterModal from 'corteza-webapp-compose/src/components/Public/Record/Exporter'
import ImporterModal from 'corteza-webapp-compose/src/components/Public/Record/Importer'
import AutomationButtons from './Shared/AutomationButtons'
import { compose, validator, NoID } from '@cortezaproject/corteza-js'
import users from 'corteza-webapp-compose/src/mixins/users'
import { queryToFilter } from 'corteza-webapp-compose/src/lib/record-filter'
import { url } from '@cortezaproject/corteza-vue'
import draggable from 'vuedraggable'

export default {
  components: {
    ExporterModal,
    ImporterModal,
    AutomationButtons,
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
      default: () => new validator.Validated(),
    },
  },

  data () {
    return {
      processing: false,
      // prefilter from block config
      prefilter: null,

      // raw query string used to build final filter
      query: null,

      // used to construct request parameters
      // AND to store response params
      filter: {
        filter: '',
        sort: '',
        limit: 10,
        pageCursor: '',
        prevPage: '',
        nextPage: '',
      },

      selected: [],

      sortBy: undefined,
      sortDirecton: undefined,

      // This counter helps us generate unique ID's for the lifetime of this
      // component
      ctr: 0,
      items: [],
      idPrefix: `rl:${this.blockIndex}`,
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
      pages: 'page/set',
    }),

    loaderCollSpan () {
      // 1 for right side actions
      let base = this.fields.length + 1
      if (this.options.draggable && this.inlineEditing) base++
      if (this.options.selectable) base++
      return base
    },

    showHeader () {
      return !!(this.block.title || Object.keys(this.recordListModule.labels || {}).includes('federation'))
    },

    showFooter () {
      return !this.options.hidePaging && !this.inlineEditing
    },

    hasRightActions () {
      return this.editing
    },

    hasPrevPage () {
      return this.filter.prevPage
    },

    hasNextPage () {
      return this.filter.nextPage
    },

    editing () {
      return this.mode === 'editor'
    },

    disableSelectAll () {
      if (this.options.hidePaging) {
        return !this.items.length
      }
      return this.items.length === 0
    },

    inlineEditing () {
      return !!this.options.editable && !!this.editing
    },

    /**
     * Check if all rows are selected
     */
    areAllRowsSelected () {
      return this.selected.length === this.items.length
    },

    areAllRowsDeleted () {
      const selItems = this.items.filter(({ id }) => this.selected.includes(id))
      return !!this.selected.length && !selItems.find(({ r }) => !r.deletedAt)
    },

    // Returns module, configured for this record list
    recordListModule () {
      if (this.options.moduleID) {
        return this.getModuleByID(this.options.moduleID)
      } else {
        return undefined
      }
    },

    // Tries to determine ID of the page we're supposed to redirect
    recordPageID () {
      // Relying on pages having unique moduleID,
      const { moduleID } = this.recordListModule || {}
      if (!moduleID) {
        return undefined
      }

      const { pageID } = this.pages.find(p => p.moduleID === moduleID) || {}
      if (!pageID) {
        return undefined
      }

      return pageID
    },

    fields () {
      let fields = []

      const editable = (!this.options.editable || !this.editing)
        ? []
        : this.options.editFields.map(({ name }) => name)

      if (this.options.fields.length > 0) {
        fields = this.recordListModule.filterFields(this.options.fields)
      } else {
        // Record list block does not have any configured fields
        // Use first five fields from the module.
        fields = this.recordListModule.fields.slice(0, 5)
      }

      const configured = fields.map(mf => ({
        key: mf.name,
        label: mf.label || mf.name,
        moduleField: mf,
        sortable: !this.options.hideSorting && !(this.options.editable && this.editing),
        tdClass: 'record-value',
        editable: !!editable.find(f => mf.name === f),
        required: this.inlineEditing && mf.isRequired,
      }))

      const pre = []
      const post = []

      return [
        ...pre,
        ...configured,
        ...post,
      ]
    },
  },

  watch: {
    query: throttle(function (e) {
      this.filter.query = queryToFilter(this.query, this.prefilter, this.recordListModule.filterFields(this.options.fields))
      this.refresh()
    }, 500),
  },

  created () {
    this.prepRecordList()
    this.$root.$on(`record-line:collect:${this.page.pageID}-${this.blockIndex}`, this.resolveRecords)
    this.$root.$on(`page-block:validate:${this.page.pageID}-${this.blockIndex}`, this.validatePageBlock)
    this.pullRecords()
  },

  beforeDestroy () {
    this.$root.$off(`record-line:collect:${this.page.pageID}-${this.blockIndex}`)
    this.$root.$off(`page-block:validate:${this.page.pageID}-${this.blockIndex}`)
  },

  methods: {
    onSelectRow (selected, item) {
      if (selected) {
        if (this.selected.includes(item.id)) {
          return
        }

        this.selected.push(item.id)
      } else {
        const i = this.selected.indexOf(item.id)
        if (i < 0) {
          return
        }
        this.selected.splice(i, 1)
      }
    },

    sorterStyle ({ key }, dir) {
      if (this.sortBy !== key || dir !== this.sortDirecton) {
        return {}
      }

      return { color: 'black' }
    },

    // Grabs errors specific to this record item
    recordErrors (item, field) {
      if (field) {
        return this.errors.filterByMeta('id', item.id)
          .filterByMeta('field', field.key)
      }
      return this.errors.filterByMeta('id', item.id)
    },

    wrapRecord (r, id) {
      if (r.id) {
        id = r.id
        r = r.r
      }

      return {
        r,
        id: id || (r.recordID !== NoID ? r.recordID : `${this.idPrefix}:${this.ctr++}`),
        _rowVariant: r.deletedAt ? 'danger' : undefined,
      }
    },

    addInline () {
      const r = new compose.Record(this.recordListModule, {})
      this.items.unshift(this.wrapRecord(r))
    },

    /**
     * Helper method to fetch all records available to this record list
     * at the given point in time.
     *
     * It:
     *    * assures that local records have a sequencial indexing
     *    * appends aditional meta fields
     *    * resolves payloadediting
     */
    resolveRecords (resolve) {
      this.ctr = 0
      this.items = this.items.map(this.wrapRecord)

      resolve({
        items: this.items,
        module: this.recordListModule,
        refField: this.options.refField,
        positionField: this.options.positionField,
        idPrefix: this.idPrefix,
      })
    },

    validatePageBlock (resolve) {
      // For now, only record lines should be validated
      if (!this.options.editable) {
        resolve({ valid: true })
      }

      // Find all required fields
      const req = new Set(this.module.fields.filter(({ isRequired = false }) => isRequired).map(({ name }) => name))

      // Check if all required fields are there
      for (const f of this.options.editFields) {
        req.delete(f.name)
      }

      // If required fields are satisfied, then the validation passes
      resolve({ valid: !req.size })
    },

    handleDeleteInline (item, i) {
      const r = new compose.Record(this.recordListModule, { ...item.r, deletedAt: new Date() })
      this.items.splice(i, 1, this.wrapRecord(r, item.id))
    },

    handleRestoreInline (item, i) {
      const r = new compose.Record(this.recordListModule, { ...item.r, deletedAt: undefined })
      this.items.splice(i, 1, this.wrapRecord(r, item.id))
    },

    handleCloneInline (r) {
      r = new compose.Record(r.module, { ...r.values })
      this.items.splice(0, 0, this.wrapRecord(r))
    },

    // Sanitizes record list config and
    // prepares prefilter
    prepRecordList () {
      const { moduleID, presort, prefilter, editable, perPage, refField, positionField } = this.options

      // Validate props
      if (!moduleID) {
        throw Error(this.$t('notification.record.moduleOrPageNotSet'))
      }

      // If there is no current record and we are using recordID/ownerID variable in (pre)filter
      // we should disable the block
      /* eslint-disable no-template-curly-in-string */
      if (!this.record) {
        if ((prefilter || '').includes('${record')) {
          throw Error(this.$t('notification.record.invalidRecordVar'))
        }

        if ((prefilter || '').includes('${ownerID}')) {
          throw Error(this.$t('notification.record.invalidOwnerVar'))
        }
      }

      const filter = []
      let sort = ''

      if (presort) {
        sort = presort
      }

      // Initial filter
      if (prefilter) {
        const pf = this.evaluatePrefilter(prefilter, {
          record: this.record,
          recordID: (this.record || {}).recordID || 0,
          ownerID: (this.record || {}).userID || 0,
          userID: (this.$auth.user || {}).userID || 0,
        })
        filter.push(`(${pf})`)
      }

      if (editable) {
        if (positionField) {
          sort = `${positionField}`
        }

        if (refField && this.record.recordID) {
          filter.push(`(${refField} = ${this.record.recordID})`)
        }
      }

      this.prefilter = filter.join(' AND ')
      const limit = editable ? 0 : perPage
      this.filter = {
        limit,
        sort,
        filter: this.prefilter || '',
      }
    },

    // Evaluates the given prefilter. Allows JS template literal expressions
    // such as id = ${recordID}
    evaluatePrefilter (prefilter, { record, recordID, ownerID, userID }) {
      return (function (prefilter) {
        /* eslint-disable no-eval */
        return eval('`' + prefilter + '`')
      })(prefilter)
    },

    createReminder (record) {
      // Determine initial reminder title
      const tField = ((this.options.fields || []).find(({ name }) => !!record.values[name]) || {}).name
      const title = record.values[tField]

      const payload = {
        title,
        link: {
          namespaceSlug: this.namespace.slug,
          pageID: this.recordPageID,
          moduleID: record.moduleID,
        },
      }
      const resource = `compose:record:${record.recordID}`
      this.$root.$emit('reminder.create', { payload, resource })
      this.$root.$emit('rightPanel.toggle', true)
    },

    onExport (e) {
      const { namespaceID, moduleID } = this.filter || {}
      const { filterRaw, timezone } = e
      e = {
        ...e,
        namespaceID,
        moduleID,
        filename: `${this.namespace.slug} - ${this.recordListModule.name}`,
      }

      if (filterRaw.rangeType === 'range') {
        e.filename += ` - ${filterRaw.date.start} - ${filterRaw.date.end}`
      } else {
        e.filename += ` - ${filterRaw.rangeType}`
      }

      if (timezone) {
        e.filename += ` - ${timezone.label}`
      }

      if (filterRaw.includeQuery) {
        // Prefilter + Query
        const queryF = queryToFilter(filterRaw.query, this.prefilter, this.recordListModule.filterFields(this.options.fields))
        if (e.filters) {
          e.filters = `(${e.filters}) AND `
        } else {
          e.filters = ''
        }
        if (queryF) {
          e.filters += encodeURI(`(${queryF})`)
        }
      } else {
        // Include only prefilter
        e.filters = queryToFilter('', this.prefilter, this.recordListModule.filterFields(this.options.fields))
      }

      const exportUrl = url.Make({
        url: `${this.$ComposeAPI.baseURL}${this.$ComposeAPI.recordExportEndpoint(e)}`,
        query: {
          fields: e.fields,
          filter: e.filters,
          jwt: this.$auth.JWT,
          timezone: timezone ? timezone.tzCode : undefined,
        },
      })

      window.open(exportUrl)
    },

    handleRowClicked ({ r: { recordID } }) {
      if (this.options.editable && this.editing) {
        return
      }

      const pageID = this.recordPageID
      this.$router.push({
        name: 'page.record',
        params: {
          pageID,
          recordID,
        },
        query: null,
      })
    },

    handleSort ({ key, sortable }) {
      if (!sortable) {
        return
      }

      if (this.sortBy !== key) {
        this.filter.sort = `${key}`
        this.sortDirecton = 'ASC'
      } else {
        if (this.sortDirecton === 'ASC') {
          this.filter.sort = `${key} DESC`
          this.sortDirecton = 'DESC'
        } else {
          this.filter.sort = `${key}`
          this.sortDirecton = 'ASC'
        }
      }
      this.sortBy = key
      this.refresh()
    },

    goToPage (page) {
      this.filter.pageCursor = this.filter[page]
      this.refresh()
    },

    handleSelectAllOnPage ({ isChecked }) {
      if (isChecked) {
        this.selected = this.items.map(({ id }) => id)
      } else {
        this.selected = []
      }
    },

    handleRestoreSelectedRecords () {
      const sel = new Set(this.selected)
      for (let i = 0; i < this.items.length; i++) {
        if (sel.has(this.items[i].id)) {
          this.handleRestoreInline(this.items[i], i)
        }
      }
    },

    handleDeleteSelectedRecords () {
      if (this.selected.length === 0) {
        return
      }

      if (this.inlineEditing) {
        const sel = new Set(this.selected)
        for (let i = 0; i < this.items.length; i++) {
          if (sel.has(this.items[i].id)) {
            this.handleDeleteInline(this.items[i], i)
          }
        }
      } else {
        const r = this.items[0].r
        const { moduleID, namespaceID } = r

        this.$ComposeAPI
          .recordBulkDelete({ moduleID, namespaceID, recordIDs: this.selected })
          .then(() => { this.refresh() })
          .catch(this.stdErr)
      }
    },

    refresh () {
      this.pullRecords()
    },

    /**
     * Loader for b-table
     *
     * Will ignore b-tables input arguments for filter
     * and assemble them on our own
     */
    async pullRecords () {
      if (this.recordListModule.moduleID !== this.options.moduleID) {
        throw Error('Module incompatible, module mismatch')
      }

      const filter = queryToFilter(this.query, this.prefilter, this.recordListModule.filterFields(this.options.fields))
      this.processing = true
      this.selected = []

      const { moduleID, namespaceID } = this.recordListModule
      if (this.filter.pageCursor) {
        this.filter.sort = ''
      }

      await this.$ComposeAPI.recordList({ moduleID, namespaceID, ...this.filter, filter })
        .then(({ set, filter }) => {
          const records = set.map(r => new compose.Record(r, this.recordListModule))

          this.filter = { ...this.filter, ...filter }
          this.filter.pageCursor = undefined
          this.filter.nextPage = filter.nextPage
          this.filter.prevPage = filter.prevPage

          // Extract user IDs from record values and load all users
          const fields = this.fields.filter(f => f.moduleField).map(f => f.moduleField)
          this.fetchUsers(fields, records)

          this.items = records.map(r => this.wrapRecord(r))
        })
        .catch(this.stdErr)
        .finally(() => {
          this.processing = false
        })
    },

    stdErr (err) {
      /* eslint-disable no-console */
      console.error(err)
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ table {
  tbody {
    tr {
      td.record-value {
        cursor: pointer;
      }

      th.selector, td.selector {
        width: 25px !important;
      }
    }
  }
}

input {
  width: 200px;
}

.handle {
  cursor: grab;
}

.pointer {
  cursor: pointer;
}

// This bits are required to properly align non editable items
// in an inline editable record list
.checkbox-adjust-offset {
  margin-top: 7px;
}

.sort-adjust-offset {
  margin-top: 10px;
}

.remove-adjust-offset {
  margin-top: 5px;
}

.field-adjust-offset {
  margin-top: 8px;
}

th .required::after {
  content: "*";
  display: inline-block;
  color: $primary;
  vertical-align: sub;
  margin-left: 2px;
  width: 10px;
  height: 16px;
  overflow: hidden;
}
</style>
