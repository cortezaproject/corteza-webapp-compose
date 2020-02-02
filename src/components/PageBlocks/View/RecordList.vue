<template>
  <div v-if="recordListModule">
    <template v-if="!options.hideAddButton && recordListModule.canCreateRecord">
      <router-link class="btn btn-sm btn-outline-primary float-left"
                   :to="{
                     name: 'page.record.create',
                     params: { pageID: options.pageID, refRecord: record },
                     query: null,
                    }">

          + {{ $t('block.recordList.addRecord') }}
      </router-link>
      <importer-modal :module="recordListModule"
                      :namespace="namespace"
                      class="ml-1 float-left" />
    </template>
    <exporter-modal v-if="options.allowExport"
                    :module="recordListModule"
                    :records="records()"
                    :query="query"
                    @export="onExport"
                    class="ml-1 float-left" />

    <b-input v-if="!options.hideSearch"
           @keyup="handleQueryThrottled"
           v-model="query"
           class="float-right mw-100 mb-1"
           :placeholder="$t('general.label.search')" />

    <div>
      <b-table
        hover
        ref="table"
        responsive
        class="mb-0"
        head-variant="light"
        :items="records"
        :fields="fields"
        no-sort-reset
        @row-clicked="handleRowClick"
        @sort-changed="handleSort"
      >
        <template #head()="{ field }">
          {{ field.label }}
        </template>
        <template #cell()="{ item: r, field }">
         <span
            v-if="!recordListModule.canReadRecord"
          />
            <field-viewer
              v-else-if="field.moduleField.canReadRecordValue"
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
          <b-button
            variant="link"
            class="p-0 m-0 pr-3"
            @click.prevent="createReminder(r)">
            <font-awesome-icon
              :icon="['far', 'bell']"
            />
          </b-button>
          <router-link
            v-if="recordListModule.canCreateRecord"
            class="pr-3" :to="{ name: 'page.record.create', params: { pageID: options.pageID, values: r.values }, query: null }"
          >
            <font-awesome-icon
              :icon="['far', 'clone']"
            />
          </router-link>
          <router-link
            v-if="recordListModule.canUpdateRecord"
            :to="{ name: 'page.record.edit', params: { pageID: options.pageID, recordID: r.recordID }, query: null }"
          >
            <font-awesome-icon
              :icon="['far', 'edit']"
            />
          </router-link>
        </template>
      </b-table>
    </div>
    <b-container
      fluid
      v-if="!options.hidePaging"
      class="bg-white border-top pt-2 mt-1 m-0"
    >
      <b-row no-gutters>
        <b-col
          cols="4"
        >
          <span
            v-if="filter.count > filter.perPage"
          >
            {{ $t('block.recordList.pagination', pagingStats) }}
          </span>
          <span
            v-else
          >
            {{ $t('block.recordList.pagination_onepage', pagingStats) }}
          </span>
        </b-col>
        <b-col
          cols="8"
          class="p-0"
        >
          <b-pagination
            align="right"
            aria-controls="record-list"
            v-model="filter.page"
            :per-page="filter.perPage"
            :total-rows="filter.count"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
  <div v-else>{{ $t('general.label.loading') }}...</div>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import FieldViewer from 'corteza-webapp-compose/src/components/ModuleFields/Viewer'
import ExporterModal from 'corteza-webapp-compose/src/components/Public/Record/Exporter'
import ImporterModal from 'corteza-webapp-compose/src/components/Public/Record/Importer'
import { compose } from '@cortezaproject/corteza-js'
import { url } from '@cortezaproject/corteza-vue'
import users from 'corteza-webapp-compose/src/mixins/users'
import _ from 'lodash'

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
  },

  extends: base,

  mixins: [
    users,
  ],

  data () {
    return {
      prefilter: null,
      sortColumn: '',
      query: null,

      filter: {
        page: 1,
        perPage: 20,
        count: 0,
      },
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

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

    fields () {
      const configured = this.recordListModule
        .filterFields(this.options.fields)
        .map(mf => ({
          key: mf.name,
          label: mf.label,
          moduleField: mf,
          sortable: true,
        }))

      return [
        ...configured,
        { key: 'actions', label: '' },
      ]
    },
  },

  watch: {
    'filter.page' () {
      this.$refs.table.refresh()
    },
  },

  created () {
    this.prepRecordList()
  },

  methods: {
    prepRecordList () {
      // Validate props
      if (!this.options.moduleID || !this.options.pageID) {
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
          pageID: this.options.pageID,
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
        const queryF = this.makeQuery(filterRaw.query, this.recordListModule.filterFields(this.options.fields))
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

    handleQueryThrottled: _.throttle(function (e) { this.handleQuery(e) }, 500),

    makeQuery (q = '', fields) {
      let filter
      q = (q || '').trim()

      if (q) {
        const numQuery = Number.parseFloat(q)

        // To SQL string
        const strQuery = q
          .replace(/\*+$/, '')
          .replace(/\*/g, '%') + '%'

        const boolQuery = toBoolean(q)

        // When searching, always reset filter with prefilter + query
        filter = fields.map(qf => {
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
            return `${qf.name} LIKE '${strQuery}'`
          }
        }).filter(q => !!q)
          .join(' OR ')

        if (this.prefilter) {
          filter = `(${this.prefilter}) AND (${filter})`
        }
      } else {
        filter = this.prefilter || ''
      }

      return filter
    },

    handleRowClick ({ recordID }) {
      const { pageID } = this.options
      this.$router.push({ name: 'page.record', params: { pageID, recordID }, query: null })
    },

    handleSort ({ sortBy, sortDesc = false }) {
      this.filter.sort = `${sortBy} ${sortDesc ? 'DESC' : ''}`.trim()
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

      return this.$ComposeAPI.recordList({ ...this.recordListModule, ...this.filter })
        .then(({ set, filter }) => {
          const records = set.map(r => Object.freeze(new compose.Record(r, this.recordListModule)))

          this.filter = { ...this.filter, ...filter }
          console.log(this.filter, filter)

          // Extract user IDs from record values and load all users
          this.fetchUsers(this.columns, records)

          return records
        })
        .catch(this.stdErr)
    },

    stdErr (err) {
      console.error(err)
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .VuePagination {
  .pagination {
    float: right;

    .VuePagination__pagination-item-prev-chunk,
    .VuePagination__pagination-item-next-chunk {
      display: none;
    }
  }
}

table {
  tr {
    cursor: pointer;
  }
}

input {
  width: 200px;
}
</style>
