<template>
  <div v-if="recordListModule">
    <span v-if="!options.hideAddButton">
      <router-link v-if="recordListModule.canCreateRecord"
                   class="btn btn-sm btn-outline-primary float-left"
                   :to="{
                     name: 'page.record.create',
                     params: { pageID: options.pageID, refRecord: record },
                     query: null,
                    }">

          + {{ $t('block.recordList.addRecord') }}

      </router-link>

      <importer-modal v-if="recordListModule.canCreateRecord"
                      :module="recordListModule"
                      :namespace="namespace"
                      class="ml-1 float-left" />

      <exporter-modal v-if="options.allowExport"
                      :module="recordListModule"
                      :records="records"
                      @export="onExport"
                      class="ml-1 float-left" />
    </span>
    <b-input v-if="!options.hideSearch"
           @keyup.enter.prevent="handleQuery"
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
            <td v-if="recordListModule.canUpdateRecord"
                class="text-right text-nowrap">

              <b-button variant="link"
                        @click.prevent="createReminder(row)">
                <font-awesome-icon :icon="['far', 'bell']" />
              </b-button>
              <router-link
                :to="{ name: 'page.record.edit', params: { pageID: options.pageID, recordID: row.recordID }, query: null }">
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
      showExportModal: false,
      prefilter: null,
      sortColumn: '',
      query: null,

      filter: {
        count: 0,
        page: 1,
        perPage: 20,
        sort: '',
        filter: '',
      },

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

  beforeMount () {
    if (!this.options.moduleID || !this.options.pageID) {
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

    this.filter.sort = this.options.presort
    this.filter.filter = this.options.prefilter
    this.filter.perPage = this.options.perPage

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

    if (this.options.presort) {
      this.handleSort(this.filter.sort)
    }

    if (this.recordListModule) {
      this.rl.fetch(this.$ComposeAPI, this.recordListModule, this.filter).then(({ records, filter }) => {
        this.recordsRaw = records
        this.filter.count = filter.count
      })
    }
  },

  methods: {
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
    // handleQuery takes prefilter and merges it query expression over all columns we're showing
    // ie: Return records that have strings in columns (fields) we're showing that start with <query> in case
    //     of text or are exactly the same in case of numbers
    handleQuery () {
      let filter = this.prefilter

      if (this.query.trim().length > 0) {
        // Is this number we're searching?
        const numQuery = Number.parseFloat(this.query)

        // Replace * wildcard with SQL's % and append on at the end to enable
        // fixed-prefix search by default
        const strQuery = this.query.replace('*', '%') + '%'

        // When searching, always reset filter with prefilter + query
        filter = this.recordListModule.filterFields(this.options.fields).map(qf => {
          if (qf.kind === 'Number' && !isNaN(numQuery)) {
            return `${qf.name} = ${numQuery}`
          }

          if (['String', 'DateTime', 'Select', 'Url', 'Email'].includes(qf.kind)) {
            return `${qf.name} LIKE '${strQuery}'`
          }
        }).filter(q => !!q).join(' OR ')

        if (this.prefilter) {
          filter = `(${this.prefilter}) AND (${filter})`
        }
        this.filter.page = 1
      }
      this.rl.fetch(this.$ComposeAPI, this.recordListModule, { ...this.filter, filter }).then(({ records, filter }) => {
        this.recordsRaw = records
        this.filter.count = filter.count
      })
    },

    handleSort (fieldName) {
      if (this.options.hideSorting) {
        return
      }

      let sort = this.sortColumn === fieldName ? fieldName + ' DESC' : fieldName
      this.sortColumn = sort

      this.rl.fetch(this.$ComposeAPI, this.recordListModule, { ...this.filter, sort }).then(({ records, filter }) => {
        this.recordsRaw = records
        this.filter.count = filter.count
      })
    },

    isSortedBy (name) {
      if (this.sortColumn.includes(name)) {
        if (this.sortColumn.includes('DESC')) {
          return 'DESC'
        } else {
          return 'ASC'
        }
      }
      return false
    },

    handlePageChange (page) {
      this.rl.fetch(this.$ComposeAPI, this.recordListModule, { ...this.filter, page }).then(({ records, filter }) => {
        this.recordsRaw = records
        this.filter.count = filter.count
        this.filter.page = page
      })
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
