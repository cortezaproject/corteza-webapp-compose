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
                      :records="records"
                      @export="onExport"
                      class="ml-1 float-left" />

    <b-input v-if="!options.hideSearch"
           @keyup="handleQueryThrottled"
           v-model="query"
           class="float-right mw-100 mb-1"
           :placeholder="$t('general.label.search')" />

    <div class="table-responsive">
      <table class="table sticky-header table-hover" :class="{sortable: !options.hideSorting}">
        <thead v-if="!options.hideHeader" class="border-bottom">
          <tr>
            <th v-for="(col) in columns" :key="'header:'+col.name" @click="handleSort(col.name)" class="text-nowrap">
              {{ col.label || col.name }}
              <span v-if="!options.hideSorting" class="ml-1">
                <font-awesome-icon v-if="!isSortedBy(col.name)" :icon="['fas', 'sort']"></font-awesome-icon>
                <font-awesome-icon v-else-if="isSortedBy(col.name) === 'ASC'" :icon="['fas', 'sort-up']"></font-awesome-icon>
                <font-awesome-icon v-else-if="isSortedBy(col.name) === 'DESC'" :icon="['fas', 'sort-down']"></font-awesome-icon>
              </span>
            </th>
            <th v-if="recordListModule.canUpdateRecord"></th>
          </tr>
        </thead>
        <tbody>
          <router-link tag="tr" v-for="(row) in records" :key="row.recordID" :to="{ name: 'page.record', params: { pageID: options.pageID, recordID: row.recordID }, query: null }">
            <td v-if="!recordListModule.canReadRecord">
              <i class="text-secondary">{{ $t('block.recordList.record.noPermission') }}</i>
            </td>
            <td v-for="(col) in columns" :key="row.recordID+':'+col.name">
              <span v-if="!recordListModule.canReadRecord"/>
              <field-viewer v-else-if="col.canReadRecordValue" :field="col" value-only :record="row" :namespace="namespace"/>
              <i v-else class="text-secondary">{{ $t('field.noPermission') }}</i>
            </td>
            <td class="text-right text-nowrap">
              <b-button variant="link"
                        @click.prevent="createReminder(row)">
                <font-awesome-icon :icon="['far', 'bell']" />
              </b-button>
              <router-link v-if="recordListModule.canUpdateRecord" :to="{ name: 'page.record.edit', params: { pageID: options.pageID, recordID: row.recordID }, query: null }">
                <font-awesome-icon :icon="['far', 'edit']"></font-awesome-icon>
              </router-link>
            </td>
          </router-link>
        </tbody>
      </table>
    </div>
    <div class="position-sticky fixed-bottom bg-white border-top pt-1" v-if="!options.hidePaging">
      <pagination :records="filter.count"
                  :per-page="filter.perPage"
                  @paginate="handlePageChange"
                  :page="filter.page"
                  :options="{ texts: { count: $t('block.recordList.pagination') } }" />
    </div>
  </div>
  <div v-else>{{ $t('general.label.loading') }}...</div>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import FieldViewer from 'corteza-webapp-compose/src/lib/field/Viewer'
import ExporterModal from 'corteza-webapp-compose/src/components/Public/Record/Exporter'
import ImporterModal from 'corteza-webapp-compose/src/components/Public/Record/Importer'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import Pagination from 'vue-pagination-2'
import _ from 'lodash'
import { RecordList } from '../RecordList'
import { make } from 'corteza-webapp-common/src/lib/url'

export default {
  components: {
    Pagination,
    FieldViewer,
    ExporterModal,
    ImporterModal,
  },

  extends: base,

  data () {
    return {
      prefilter: null,
      sortColumn: '',
      query: null,

      // Initialized by prepRecordList()
      filter: {},

      recordsRaw: [],
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

    rl () {
      return new RecordList(this.options)
    },

    // Returns module, configured for this record list
    recordListModule () {
      if (this.options.moduleID) {
        return this.getModuleByID(this.options.moduleID)
      } else {
        return undefined
      }
    },

    columns () {
      return this.recordListModule.filterFields(this.options.fields)
    },

    records () {
      if (!this.recordListModule) {
        return []
      }
      return this.recordsRaw.map(r => new Record(this.recordListModule, r))
    },
  },

  created () {
    this.prepRecordList()
    this.updateRecordList(this.filter)

    this.$root.$on('recordList.refresh', this.updateRecordList)
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
      const tField = (this.options.fields.find(({ name }) => !!record.values[name]) || {}).name
      let title = record.values[tField]

      let payload = {
        title,
        link: {
          namespaceSlug: this.namespace.slug,
          pageID: this.options.pageID,
          moduleID: record.moduleID,
        },
      }
      let resource = `compose:record:${record.recordID}`
      this.$root.$emit('reminder.create', { payload, resource })
      this.$root.$emit('rightPanel.toggle', true)
    },

    onExport (e) {
      const { namespaceID, moduleID } = this.filter || {}
      e = {
        ...e,
        namespaceID,
        moduleID,
        filename: 'export',
      }

      const url = make({
        url: `${this.$ComposeAPI.baseURL}${this.$ComposeAPI.recordExportEndpoint(e)}`,
        query: {
          fields: e.fields,
          filter: e.filters,
          jwt: this.$auth.JWT,
        },
      })

      window.open(url)
    },

    handleQueryThrottled: _.throttle(function (e) { this.handleQuery(e) }, 500),

    // Merges prefilter with query
    handleQuery () {
      let filter

      if (this.query.trim().length > 0) {
        let numQuery, strQuery
        numQuery = Number.parseFloat(this.query)

        // To SQL string
        strQuery = this.query
          .replace(/\*+$/, '')
          .replace(/\*/g, '%') + '%'

        // When searching, always reset filter with prefilter + query
        filter = this.recordListModule.filterFields(this.options.fields).map(qf => {
          if (qf.kind === 'Number' && !isNaN(numQuery)) {
            return `${qf.name} = ${numQuery}`
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

      this.filter.page = 1
      this.updateRecordList({ ...this.filter, filter })
    },

    handleSort (fieldName) {
      if (this.options.hideSorting) {
        return
      }

      let sort = this.filter.sort === fieldName ? `${fieldName} DESC` : fieldName
      this.updateRecordList({ ...this.filter, sort })
    },

    isSortedBy (name) {
      const { sort = '' } = this.filter
      if (sort.includes(name)) {
        if (sort.includes('DESC')) {
          return 'DESC'
        } else {
          return 'ASC'
        }
      }
      return false
    },

    handlePageChange (page) {
      this.updateRecordList({ ...this.filter, page })
    },

    // Helper to fetch records, update filter, ...
    async updateRecordList (filter = this.filter) {
      if (this.recordListModule.moduleID !== this.options.moduleID) {
        throw Error('Module incompatible, module mismatch')
      }

      return this.$ComposeAPI.recordList({ ...this.recordListModule, ...filter })
        .then(({ set, filter }) => {
          this.recordsRaw = set
          this.filter = {
            ...this.filter,
            ...filter,
          }
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
