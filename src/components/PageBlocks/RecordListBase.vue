<template>
  <wrap v-bind="$props" v-on="$listeners">
    <template #toolbar>
      <b-container
        ref="header"
        class="m-0 px-2 pt-2"
        fluid
      >
        <b-row
          no-gutters
          class="m-0 p-0"
        >
         <b-col
            cols="6"
          >
            <template v-if="!options.hideAddButton && recordListModule.canCreateRecord && recordPageID">
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
            <exporter-modal
              v-if="options.allowExport"
              :module="recordListModule"
              :record-count="pagingStats.count"
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
              v-if="!options.hideSearch"
              v-model="query"
              class="float-right mw-100 mb-1"
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
            {{ $t('block.recordList.selected', { count: selected.length, total: filter.count }) }}
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
              @confirmed="handleDeleteSelectedRecords()"
              variant="link-light"
            />
          </b-col>
        </b-row>
      </b-container>
    </template>
    <template #default>
      <b-table
        hover
        ref="table"
        :responsive="true"
        :sticky-header="true"
        :show-empty="true"
        :small="false"
        :selectable="options.selectable"
        :select-mode="options.selectMode"
        class="mh-100 m-0 mt-0 mb-2"
        :items="records"
        :fields="fields"
        no-sort-reset
        @sort-changed="handleSort"
        @row-selected="handleRowSelected"
        @row-clicked="handleRowClicked"
      >
        <template #head()="{ field }">
          {{ field.label }}
        </template>
        <template #cell()="{ item: r, field }">
          <field-viewer
            v-if="field.moduleField.canReadRecordValue"
            :field="field.moduleField"
            value-only
            :record="r"
            :module="module"
            :namespace="namespace"
          />
          <i
            v-else
            class="text-secondary"
          >
            {{ $t('field.noPermission') }}
          </i>
        </template>
        <template #cell(actions)="{ item: r }">
          <div class="text-right">
            <b-button
              v-if="!options.hideRecordReminderButton"
              variant="link"
              class="p-0 m-0 pl-1 text-secondary"
              @click.prevent="createReminder(r)">
              <font-awesome-icon
                :icon="['far', 'bell']"
              />
            </b-button>
            <b-button
              v-if="!options.hideRecordCloneButton && recordListModule.canCreateRecord && recordPageID"
              variant="link"
              class="p-0 m-0 pl-1 text-secondary"
              :to="{ name: 'page.record.create', params: { pageID: recordPageID, values: r.values }, query: null }"
            >
              <font-awesome-icon
                :icon="['far', 'clone']"
              />
            </b-button>
            <b-button
              v-if="!options.hideRecordEditButton && recordListModule.canUpdateRecord && recordPageID"
              variant="link"
              class="p-0 m-0 pl-1 text-secondary"
              :to="{ name: 'page.record.edit', params: { pageID: recordPageID, recordID: r.recordID }, query: null }"
            >
              <font-awesome-icon
                :icon="['far', 'edit']"
              />
            </b-button>
            <b-button
              v-if="!options.hideRecordViewButton && recordPageID"
              variant="link"
              class="p-0 m-0 pl-1 text-secondary"
              :to="{ name: 'page.record', params: { pageID: recordPageID, recordID: r.recordID }, query: null }"
            >
              <font-awesome-icon
                :icon="['far', 'eye']"
              />
            </b-button>
          </div>
        </template>
        <template #head(selectable)>
          <b-checkbox
            :disabled="pagingStats.count === 0"
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
    <template
      v-if="!options.hidePaging"
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
          <b-col
            class="pt-1 text-nowrap text-truncate"
            cols="8"
          >
            <span
              v-if="filter.count > filter.perPage"
            >
              {{ $t('block.recordList.pagination', pagingStats) }}
            </span>
            <span
              v-else
            >
              {{ $t('block.recordList.paginationSingle', pagingStats) }}
            </span>
          </b-col>
          <b-col
            cols="4"
          >
            <b-pagination
              v-if="filter.count > filter.perPage"
              align="right"
              aria-controls="record-list"
              class="m-0"
              size="sm"
              v-model="filter.page"
              :per-page="filter.perPage"
              :total-rows="filter.count"
            />
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
import ExporterModal from 'corteza-webapp-compose/src/components/Public/Record/Exporter'
import ImporterModal from 'corteza-webapp-compose/src/components/Public/Record/Importer'
import AutomationButtons from './Shared/AutomationButtons'
import { compose } from '@cortezaproject/corteza-js'
import users from 'corteza-webapp-compose/src/mixins/users'
import { url } from '@cortezaproject/corteza-vue'

// Helper to determine if and value for given bool query
// == is intentional
const toBoolean = (v) => {
  /* eslint-disable eqeqeq */
  if (v == 'false' || v == 0) {
    return false
  }
  if (v == 'true' || v == 1) {
    return true
  }

  return undefined
}

export default {
  components: {
    FieldViewer,
    ExporterModal,
    ImporterModal,
    AutomationButtons,
  },

  extends: base,

  mixins: [
    users,
  ],

  data () {
    return {
      // prefilter from block config
      prefilter: null,

      // raw query string used to build final filter
      query: null,

      // used to construct request parameters
      // AND to store response params
      filter: {
        filter: '',
        sort: '',
        page: 1,
        perPage: 20,
        count: 0,
      },

      selected: [],
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
      pages: 'page/set',
    }),

    /**
     * Check if all rows are selected
     */
    areAllRowsSelected () {
      const { count, perPage } = this.filter
      return this.selected.length === (count < perPage ? count : perPage)
    },

    pagingStats () {
      const { page, perPage, count } = this.filter
      let pages = Math.ceil(count / perPage)
      if (pages < 1) { pages = 1 }

      return {
        from: ((page - 1) * perPage) + 1,
        to: (page * perPage),
        page,
        count,
        pages,
      }
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
        sortable: true,
        tdClass: 'record-value',
      }))

      const pre = []
      const post = []

      if (this.options.selectable) {
        pre.push({ key: 'selectable', label: '', tdClass: 'selector', thClass: 'selector' })
      }

      post.push({ key: 'actions', label: '', tdClass: 'actions' })

      return [
        ...pre,
        ...configured,
        ...post,
      ]
    },
  },

  watch: {
    'filter.page' () {
      this.refresh()
    },

    query: throttle(function (e) {
      this.filter.query = this.queryToFilter(this.query)
      this.refresh()
    }, 500),
  },

  created () {
    this.prepRecordList()
  },

  methods: {
    // Sanitizes record list config and
    // prepares prefilter
    prepRecordList () {
      // Validate props
      if (!this.options.moduleID) {
        throw Error(this.$t('notification.record.moduleOrPageNotSet'))
      }

      // If there is no current record and we are using recordID/ownerID variable in (pre)filter
      // we should disable the block
      /* eslint-disable no-template-curly-in-string */
      if (!this.record) {
        if ((this.options.prefilter || '').includes('${record')) {
          throw Error(this.$t('notification.record.invalidRecordVar'))
        }

        if ((this.options.prefilter || '').includes('${ownerID}')) {
          throw Error(this.$t('notification.record.invalidOwnerVar'))
        }
      }

      // Initial filter
      if (this.options.prefilter) {
        this.prefilter = this.evaluatePrefilter(this.options.prefilter, {
          record: this.record,
          recordID: (this.record || {}).recordID || 0,
          ownerID: (this.record || {}).userID || 0,
          userID: (this.$auth.user || {}).userID || 0,
        })
      }

      this.filter = {
        count: 0,
        page: this.options.page || 1,
        perPage: this.options.perPage || 20,
        sort: this.options.presort || '',
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
      const { filterRaw } = e
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

      if (filterRaw.includeQuery) {
        const queryF = this.queryToFilter(filterRaw.query)
        if (e.filters) {
          e.filters = `(${e.filters}) AND `
        } else {
          e.filters = ''
        }
        if (queryF) {
          e.filters += encodeURI(`(${queryF})`)
        }
      }

      window.open(url.Make({
        url: `${this.$ComposeAPI.baseURL}${this.$ComposeAPI.recordExportEndpoint(e)}`,
        query: {
          fields: e.fields,
          filter: e.filters,
          jwt: this.$auth.JWT,
        },
      }))
    },

    // Takes fields and prefilter and merges it query expression over all columns we're showing
    // ie: Return records that have strings in columns (fields) we're showing that start with <query> in case
    //     of text or are exactly the same in case of numbers
    queryToFilter (query = '') {
      query = (query || '').trim()

      if (!query) {
        return this.prefilter || ''
      }

      const boolQuery = toBoolean(query)
      const numQuery = Number.parseFloat(query)

      // To SQLish LIKE param
      const strQuery = query
        // replace * with %
        .replace(/[*%]+/g, '%')
        // Remove all trailing * and %
        .replace(/[%]+$/, '')
        // Remove all leading * and %
        .replace(/^[%]+/, '')

      // When searching, always reset filter with prefilter + query
      query = this.recordListModule.filterFields(this.options.fields).map(qf => {
        if (qf.kind === 'Number' && !isNaN(numQuery)) {
          return `${qf.name} = ${numQuery}`
        }

        if (qf.kind === 'Bool' && boolQuery !== undefined) {
          if (boolQuery) {
            return `${qf.name} = 'true'`
          } else {
            return `${qf.name} = 'false' OR ${qf.name} IS NULL`
          }
        }

        if (['String', 'DateTime', 'Select', 'Url', 'Email'].includes(qf.kind)) {
          return `${qf.name} LIKE '%${strQuery}%'`
        }
      }).filter(q => !!q)
        .join(' OR ')

      if (this.prefilter) {
        return `(${this.prefilter}) AND (${query})`
      }

      return query
    },

    handleRowClicked ({ recordID }) {
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

    handleSort ({ sortBy, sortDesc = false }) {
      this.filter.sort = `${sortBy} ${sortDesc ? 'DESC' : ''}`.trim()
      this.refresh()
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

      const { moduleID, namespaceID } = this.selected[0]

      // Assuming all records are of same module & namespace
      const recordIDs = this.selected
        .filter(r => r.moduleID === moduleID && r.namespaceID === namespaceID)
        .map(({ recordID }) => recordID)

      this.$ComposeAPI
        .recordBulkDelete({ moduleID, namespaceID, recordIDs })
        .then(() => { this.refresh() })
        .catch(this.stdErr)
    },

    refresh () {
      this.$refs.table.refresh()
    },

    /**
     * Loader for b-table
     *
     * Will ignore b-tables input arguments for filter
     * and assemble them on our own
     */
    records () {
      if (this.recordListModule.moduleID !== this.options.moduleID) {
        throw Error('Module incompatible, module mismatch')
      }

      const filter = this.queryToFilter(this.query)

      return this.$ComposeAPI.recordList({ ...this.recordListModule, ...this.filter, filter })
        .then(({ set, filter }) => {
          const records = set.map(r => Object.freeze(new compose.Record(r, this.recordListModule)))

          this.filter = { ...this.filter, ...filter }

          // Extract user IDs from record values and load all users
          const fields = this.fields.filter(f => f.moduleField).map(f => f.moduleField)
          this.fetchUsers(fields, records)

          return records
        })
        .catch(this.stdErr)
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

</style>
