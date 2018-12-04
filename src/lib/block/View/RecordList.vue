<template>
  <div v-if="misconfigured">{{ misconfigured }}</div>
  <div v-else>
    <form>here be search</form>
    <table>
      <thead>
        <tr>
          <th v-for="(col) in options.fields" :key="'header:'+col.name">{{ col.title || col.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row) in records" :key="row.contentID">
          <td v-for="(col) in options.fields" :key="row.contentID+':'+col.name">{{ row.data[col.name] }}</td>
          <td>
            <router-link :to="{ name: 'public.page.record', params: { pageID: options.pageID, recordID: row.contentID } }">Open</router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <pagination v-model="meta.page" :records="meta.count" :per-page="meta.perPage" @paginate="handlePageChange" />
    </div>
  </div>
</template>
<script>
import optionsPropMixin from './mixins/optionsProp'
import Pagination from 'vue-pagination-2'

export default {
  data () {
    return {
      misconfigured: null,

      meta: { count: 0, page: 0, perPage: 20 },
      records: [],

      query: '',
    }
  },

  mounted () {
    if (!this.options.moduleID) {
      this.misconfigured = 'Block render error: moduleID not set.'
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

      let fields = {}
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
  },
}
</script>
