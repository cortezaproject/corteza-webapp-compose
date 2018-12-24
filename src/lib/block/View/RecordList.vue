<template>
  <div v-if="error">{{ error }}</div>
  <div v-else-if="recordListModule">
    <router-link v-if="!this.options.hideAddButton"
                 :to="{ name: 'public.page.record.create', params: { pageID: options.pageID }, query: null }">Add new record</router-link>
    <input v-if="!this.options.hideSearch"
           @keypress.enter.prevent="handleQuery($event.target.value)"
           placeholder="Search" />
    <table class="table sticky-header">
      <thead>
        <tr>
          <th v-for="(col) in columns" :key="'header:'+col.name" @click="handleSort(col.name)">
            {{ col.label || col.name }}
            <font-awesome-icon :icon="['fas', 'sort']"></font-awesome-icon>
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
    <div class="sticky-footer">
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
import base from './base'
import FieldViewer from '@/lib/field/Viewer'
import Pagination from 'vue-pagination-2'
import Module from '@/lib/module'

export default {
  extends: base,

  data () {
    return {
      meta: {
        count: 0,
        page: 0,
        perPage: 20,
        sort: '',
        query: '',
      },

      error: null,

      recordListModule: this.module,
      records: [],
    }
  },

  computed: {
    columns () {
      return this.recordListModule.filterFields(this.options.fields)
    },
  },

  mounted () {
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
    fetch ({ page, perPage, sort, query } = this.meta) {
      const params = { page, perPage, sort, query }

      // This has some undesired effects on record pages, disable it for now...
      // this.$router.push({ query: params })

      params.moduleID = this.recordListModule.moduleID

      return this.$crm.moduleRecordList(params).then(({ meta, records }) => {
        this.meta = meta
        this.records = records
      }).catch(this.defaultErrorHandler('Could not load record list'))
    },

    handleQuery (query) {
      this.fetch({ ...this.meta, query })
    },

    handleSort (fieldName) {
      this.fetch({ ...this.meta, sort: this.meta.sort === fieldName ? fieldName + ' DESC' : fieldName })
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

table {
  width: 100%;

  th {
    cursor: pointer;

    .fa-sort {
      margin-left: 10px;
    }
  }
}

input {
  border: 1px solid $appgrey;
  border-radius: 5px;
  font-size: 14px;
  padding: 3px 10px;
  float: right;
  margin-bottom: 5px;
  width: 200px;
  max-width: 100%;
  position: sticky;
  top: 5px;
  z-index: 1;

  &:focus {
    border: 1px solid $appblue;
    outline: none;
  }
}
</style>
