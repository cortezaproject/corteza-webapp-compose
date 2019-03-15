<template>
  <div v-if="recordListModule">
    <router-link v-if="!options.hideAddButton"
                 class="btn-url"
                 :to="{ name: 'public.page.record.create', params: { pageID: options.pageID, refRecord: record }, query: null }">+ {{ $t('block.recordList.addRecord') }}</router-link>
    <input v-if="!options.hideSearch"
           @keyup.enter.prevent="handleQuery"
           @keyup="handleQueryThrottled"
           v-model="query"
           :placeholder="$t('general.label.search')" />
    <div class="table-responsive">
      <table class="table sticky-header table-hover" :class="{sortable: !options.hideSorting}">
        <thead v-if="!options.hideHeader">
          <tr >
            <th v-for="(col) in columns" :key="'header:'+col.name" @click="handleSort(col.name)">
              {{ $t(col.label) || col.name }}
              <font-awesome-icon :icon="['fas', 'sort']" v-if="!options.hideSorting"></font-awesome-icon>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row) in records" :key="row.recordID">
            <td v-for="(col) in columns" :key="row.recordID+':'+col.name">
              <field-viewer :field="col" value-only :record="row"></field-viewer>
            </td>
            <td class="text-right">
              <router-link
                :to="{ name: 'public.page.record', params: { pageID: options.pageID, recordID: row.recordID }, query: null }">
                <i class="action icon-search"></i></router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="sticky-footer" v-if="!options.hidePaging">
      <pagination
          :records="meta.count"
          :per-page="meta.perPage"
          @paginate="handlePageChange"
          theme="bootstrap4"
          :page="meta.page + 1"
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

      meta: {
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
      currentUser: 'auth/user',
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

    this.meta.sort = this.options.presort
    this.meta.filter = this.options.prefilter
    this.meta.perPage = this.options.perPage

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
        userID: this.currentUser.ID || 0,
      })

      this.meta.filter = this.prefilter
    }

    if (this.recordListModule) {
      this.fetch()
    }
  },

  methods: {
    fetch (params = this.meta) {
      params.moduleID = this.options.moduleID

      return this.$crm.recordList(params).then(({ meta, records }) => {
        this.meta = meta
        this.records = records.map(r => new Record(this.recordListModule, r))
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
      }

      this.fetch({ ...this.meta, filter })
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

      this.fetch({ ...this.meta, sort })
    },

    handlePageChange (page) {
      this.fetch({ ...this.meta, page: page - 1 })
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
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

.action {
  visibility: hidden;
}

table {
  width: 100%;
  margin-bottom: 0;

  tr {
    &:hover {
      .action {
        visibility: visible;
      }
    }
  }

  th {
    white-space: nowrap;

    .fa-sort {
      margin-left: 10px;
    }
  }

  &.sortable thead th {
    cursor: pointer;
  }
}

input {
  padding: 3px 10px;
  float: right;
  margin-bottom: 5px;
  width: 200px;
  max-width: 100%;

  &:focus {
    border: 1px solid $appblue;
    outline: none;
  }
}

.btn-url {
  margin-top: 5px;
  display: inline-block;
}

</style>
