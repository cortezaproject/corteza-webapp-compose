<template>
  <div v-if="recordListModule">
    <span v-if="!options.hideAddButton && recordListModule.canCreateRecord">
      <router-link
                  class="btn-url d-inline-block mt-1"
                  :to="{ name: 'page.record.create', params: { pageID: options.pageID, refRecord: record }, query: null }">+ {{ $t('block.recordList.addRecord') }}</router-link>
    </span>
    <b-input v-if="!options.hideSearch"
           @keyup.enter.prevent="handleQuery"
           @keyup="handleQueryThrottled"
           v-model="query"
           class="float-right mw-100 mb-1"
           :placeholder="$t('general.label.search')" />
    <div class="table-responsive">
      <table class="table sticky-header table-hover" :class="{sortable: !options.hideSorting}">
        <thead v-if="!options.hideHeader">
          <tr >
            <th v-for="(col) in columns" :key="'header:'+col.name" @click="handleSort(col.name)" class="text-nowrap">
              {{ $t(col.label) || col.name }}
              <font-awesome-icon :icon="['fas', 'sort']" v-if="!options.hideSorting" class="ml-1"></font-awesome-icon>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row) in records" :key="row.recordID">
            <td v-if="!recordListModule.canReadRecord">
              <i class="text-secondary">{{ $t('block.recordList.record.noPermission') }}</i>
            </td>
            <td v-for="(col) in columns" :key="row.recordID+':'+col.name">
              <span v-if="!recordListModule.canReadRecord"/>
              <field-viewer v-else-if="col.canReadRecordValue" :field="col" value-only :record="row" :namespace="namespace"/>
              <i v-else class="text-secondary">{{ $t('field.noPermission') }}</i>
            </td>
            <td v-if="recordListModule.canUpdateRecord || recordListModule.canDeleteRecord" class="text-right">
              <router-link
                :to="{ name: 'page.record', params: { pageID: options.pageID, recordID: row.recordID }, query: null }">
                <i class="action icon-search"></i></router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="position-sticky border-top pt-1" v-if="!options.hidePaging">
      <pagination
          :records="filter.count"
          :per-page="filter.perPage"
          @paginate="handlePageChange"
          :page="filter.page + 1"
          :options="{ texts: { count: $t('block.recordList.pagination') } }" />
    </div>
  </div>
  <div v-else>{{ $t('general.label.loading') }}...</div>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import FieldViewer from '@/lib/field/Viewer'
import Pagination from 'vue-pagination-2'
import _ from 'lodash'
import Record from '@/lib/record'

export default {
  components: {
    Pagination,
    FieldViewer,
  },

  extends: base,

  data () {
    return {
      prefilter: null,
      sortColumn: null,
      query: null,

      filter: {
        count: 0,
        page: 0,
        perPage: 20,
        sort: '',
        filter: '',
      },

      records: [],
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

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

    if (this.recordListModule) {
      this.fetch()
    }
  },

  methods: {
    fetch (params = this.filter) {
      params.moduleID = this.options.moduleID
      params.namespaceID = this.namespace.namespaceID

      return this.$compose.recordList(params).then(({ filter, set }) => {
        this.filter = filter
        this.records = set.map(r => new Record(this.recordListModule, r))
      }).catch(this.defaultErrorHandler(this.$t('notification.record.listLoadFailed')))
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
          filter = `${this.prefilter} AND ${filter}`
        }
        this.filter.page = 0
      }

      this.fetch({ ...this.filter, filter })
    },

    handleSort (fieldName) {
      if (this.options.hideSorting) {
        return
      }

      let sort = this.sortColumn === fieldName ? fieldName + ' DESC' : fieldName
      this.sortColumn = sort

      if (this.options.presort) {
        sort = this.options.presort + ', ' + sort
      }

      this.fetch({ ...this.filter, sort })
    },

    handlePageChange (page) {
      this.fetch({ ...this.filter, page: page - 1 })
    },

    getFieldLabel (field) {
      if (field.isSystem) {
        return this.$t(field.label)
      }
      return field.name
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .VuePagination {
  .pagination {
    float: right;

    .page-item {
      .page-link {
        outline: none;
        box-shadow: none;
      }
    }

    .VuePagination__pagination-item-prev-chunk,
    .VuePagination__pagination-item-next-chunk {
      display: none;
    }
  }
}

.action {
  visibility: hidden;
}

table {
  tr {
    &:hover {
      .action {
        visibility: visible;
      }
    }
  }

  &.sortable thead th {
    cursor: pointer;
  }
}

input {
  width: 200px;
}
</style>
