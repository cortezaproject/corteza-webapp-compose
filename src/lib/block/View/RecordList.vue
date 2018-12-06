<template>
  <div v-if="misconfigured">{{ misconfigured }}</div>
  <div v-else>
    <form>here be search</form>
    <table class="table">
      <thead>
        <tr>
          <th v-for="(col) in columns" :key="'header:'+col.name">{{ col.label || col.name }}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row) in records" :key="row.contentID">
          <td v-for="(col) in columns" :key="row.contentID+':'+col.name">
            <field-viewer :field="col" value-only :record="row"></field-viewer>
          </td>
          <td>
            <router-link
              :to="{ name: 'public.page.record', params: { pageID: options.pageID, recordID: row.contentID } }">Open</router-link>
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
          v-model="meta.page" />
    </div>
  </div>
</template>
<script>
import FieldViewer from '@/lib/field/Viewer'
import optionsPropMixin from './mixins/optionsProp'
import Pagination from 'vue-pagination-2'

export default {
  props: {
    module: {
      type: Object,
      required: true,
    }
  },

  data () {
    return {
      misconfigured: null,

      meta: { count: 0, page: 0, perPage: 20 },
      records: [],

      query: '',
    }
  },

  computed: {
    columns () {
      return this.module.filterFields(this.options.fields)
    },
  },

  mounted () {
    if (!this.options.moduleID) {
      this.misconfigured = 'Block render error: moduleID not set.'
    } else if (!this.options.pageID) {
      this.misconfigured = 'Block render error: pageID not set.'
    }

    this.fetch()
  },

  methods: {
    handlePageChange (page) {
      this.fetch({ page })
    },

    fetch ({ page = this.meta.page, perPage = this.meta.perPage } = {}) {
      const moduleID = this.options.moduleID
      const query = this.query

      const fields = {}
      this.options.fields.forEach(f => {
        fields[f.name] = null
      })

      this.$crm.moduleContentList({ moduleID, page, perPage, query }).then((result) => {
        this.meta = result.meta
        this.records = result.contents.map((row) => {
          let data = {}
          row.fields.forEach(f => {
            data[f.name] = f.value
          })

          row.data = Object.assign({}, fields, data)
          return row
        })
      })
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
  table {
    width: 100%;
  }
</style>
