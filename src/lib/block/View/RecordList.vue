<template>
  <div v-if="error">{{ error }}</div>
  <div v-else-if="module">
    <input @keypress.enter.prevent="handleQuery($event.target.value)" />
    <table class="table sticky-header">
      <thead>
        <tr>
          <th v-for="(col) in columns" :key="'header:'+col.name" @click="handleSort(col.name)">
            {{ col.label || col.name }}
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row) in records" :key="row.contentID">
          <td v-for="(col) in columns" :key="row.contentID+':'+col.name">
            <field-viewer :field="col" value-only :record="row"></field-viewer>
          </td>
          <td>
            <router-link
              :to="{ name: 'public.page.record', params: { pageID: options.pageID, recordID: row.contentID } }">
              <i class="action icon-search"></i></router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
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
import FieldViewer from '@/lib/field/Viewer'
import optionsPropMixin from './mixins/optionsProp'
import Pagination from 'vue-pagination-2'
import Module from '@/lib/module'

export default {
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

      // We'll be loading module dynamicly here
      // depending on block settings
      module: null,

      records: [],
    }
  },

  computed: {
    columns () {
      console.log(this.options.fields.length, this.module.fields.length)
      return this.module.filterFields(this.options.fields)
    },
  },

  mounted () {
    if (!this.options.moduleID) {
      this.error = 'Block render error: moduleID not set.'
    } else if (!this.options.pageID) {
      this.error = 'Block render error: pageID not set.'
    }

    this.$crm.moduleRead({ moduleID: this.options.moduleID }).then((m) => {
      this.module = new Module(m)
      this.fetch()
    }).catch(({ message }) => {
      this.error = message
    })
  },

  methods: {
    fetch ({ page, perPage, sort, query } = this.meta) {
      const params = { page, perPage, sort, query }

      this.$router.push({ query: params })

      params.moduleID = this.module.moduleID

      return this.$crm.moduleContentList(params).then((result) => {
        this.meta = result.meta
        this.records = result.contents
      }).catch(({ message }) => {
        this.error = [message]
      })
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

  mixins: [
    optionsPropMixin,
  ],

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
}
</style>
