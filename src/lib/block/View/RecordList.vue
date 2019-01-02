<template>
  <div v-if="error">{{ error }}</div>
  <div v-else-if="recordListModule">
    <router-link v-if="!options.hideAddButton"
                 class="btn-url"
                 :to="{ name: 'public.page.record.create', params: { pageID: options.pageID }, query: null }">+ Add new record</router-link>
    <input v-if="!options.hideSearch"
           @keyup.enter.prevent="handleQuery"
           @keyup="handleQueryThrottled"
           v-model="query"
           placeholder="Search" />
    <div class="table-responsive">
      <table class="table sticky-header" :class="{sortable: !options.hideSorting}">
        <thead v-if="!options.hideHeader">
          <tr >
            <th v-for="(col) in columns" :key="'header:'+col.name" @click="handleSort(col.name)">
              {{ col.label || col.name }}
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
    <div class="sticky-footer" v-if="options.hidePaging">
      <pagination
          :records="meta.count"
          :per-page="meta.perPage"
          @paginate="handlePageChange"
          theme="bootstrap4"
          :page="meta.page + 1" />
    </div>
  </div>
  <div v-else>Loading...</div>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import FieldViewer from '@/lib/field/Viewer'
import Pagination from 'vue-pagination-2'
import Module from '@/lib/module'
import _ from 'lodash'

export default {
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

      error: null,

      recordListModule: this.module,
      records: [],
    }
  },

  computed: {
    ...mapGetters({
      currentUser: 'auth/user',
    }),

    columns () {
      return this.recordListModule.filterFields(this.options.fields)
    },
  },

  mounted () {
    this.meta.sort = this.options.presort
    this.meta.filter = this.options.prefilter
    this.meta.perPage = this.options.perPage

    if (this.options.prefilter) {
      // Create a sandbox for evaling prefilter as a template
      // This will allow us to pass ${recordID}, ${ownerID}, ${userID} etc
      // as parameters
      this.prefilter = (function (prefilter, { recordID, ownerID, userID }) {
        // eslint-disable-next-line
        return eval('`' + prefilter + '`')
      })(this.options.prefilter, {
        recordID: (this.record || {}).recordID,
        ownerID: (this.record || {}).userID,
        userID: this.currentUser.userID,
      })

      this.meta.filter = this.prefilter
    }

    if (this.recordListModule && this.recordListModule.moduleID === this.options.moduleID) {
      this.fetch()
      return
    }

    if (!this.options.moduleID) {
      this.error = 'Block render error: moduleID not set.'
    } else if (!this.options.pageID) {
      this.error = 'Block render error: pageID not set.'
    }

    this.$crm.moduleRead({ moduleID: this.options.moduleID }).then((m) => {
      this.recordListModule = new Module(m)
      this.fetch()
    }).catch(this.defaultErrorHandler('Could not load record\' module'))
  },

  methods: {
    fetch (params = this.meta) {
      params.moduleID = this.options.moduleID

      return this.$crm.moduleRecordList(params).then(({ meta, records }) => {
        this.meta = meta
        this.records = records
      }).catch(this.defaultErrorHandler('Could not load record list'))
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
          if (qf.kind === 'Number' && !numQuery.isNaN()) {
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
  },

  components: {
    Pagination,
    FieldViewer,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

table {
  width: 100%;
  margin-bottom: 0;

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
