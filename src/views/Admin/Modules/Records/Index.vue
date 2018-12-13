<template>
  <section class="container well" id="modules-contents-index" v-if="module">
    <router-link :to="{name: 'admin.modules'}" class="btn btn-url">&#171; Back to module list</router-link><br>
    <h2>{{module.name}}</h2>
    <router-link :to="{name: 'admin.modules.edit', params: { moduleID }}" class="edit-module">
    <i class="icon-edit"></i>
    </router-link>
    <hr />
    <input @keypress.enter.prevent="handleQuery($event.target.value)" placeholder="Search" />
    <table class="table sticky-header">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.name" @click="handleSort(col.name)">
            {{col.label || col.name}}
          </th>
          <th class="text-right"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in records">
          <tr :key="row.contentID">
            <td v-for="col in module.fields" :key="'modules-contents-' + row.id + '-' + col.name">
              <field-viewer :field="col" :record="row" value-only />
            </td>
            <td class="text-right actions">
              <confirmation-toggle @confirmed="handleDelete(row.contentID)" class="confirmation-small" cta-class="btn-url">
                <i class="action icon-trash"></i>
              </confirmation-toggle>
              <router-link :to="{name: 'admin.modules.records.edit', params: { moduleID, recordID: row.contentID }}">
                <i class="icon-edit"></i>
              </router-link>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <router-link :to="{name: 'admin.modules.records.add', params: { moduleID }}" class="btn-url add-new">&#43; Add new entry</router-link>
    <div class="sticky-footer">
      <pagination
        :records="meta.count"
        :per-page="meta.perPage"
        @paginate="handlePageChange"
        theme="bootstrap4"
        :page="meta.page + 1" />
    </div>

    <template v-if="!records.length">
      <p>No content rows added yet.</p>
    </template>

  </section>
</template>

<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import FieldViewer from '@/lib/field/Viewer'
import Module from '@/lib/module'
import Pagination from 'vue-pagination-2'

export default {
  props: {
    moduleID: String,
  },
  data () {
    return {
      meta: {
        count: 0,
        page: 0,
        perPage: 20,
        sort: '',
        query: '',
      },

      module: null,
      records: [],
    }
  },

  computed: {
    columns () {
      // @filter out the fields we want to see here
      return this.module.fields
    },
  },

  mounted () {
    this.$crm.moduleRead({ moduleID: this.moduleID }).then(m => {
      this.module = new Module(m)
      return this.fetch()
    }).catch(this.defaultErrorHandler('Could not load record\'s module'))
  },

  methods: {
    fetch ({ page, perPage, sort, query } = this.meta) {
      const params = { page, perPage, sort, query }

      this.$router.push({ query: params })

      params.moduleID = this.module.moduleID

      return this.$crm.moduleContentList(params).then((result) => {
        this.meta = result.meta
        this.records = result.contents
      }).catch(this.defaultErrorHandler('Could not load this record'))
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

    handleDelete (recordID) {
      this.$crm.moduleContentDelete({ moduleID: this.moduleID, contentID: recordID }).then(r => {
        this.raiseSuccessAlert('Record deleted')
        this.fetch()
      }).catch(this.defaultErrorHandler('Could not delete this record'))
    },
  },

  components: {
    Pagination,
    FieldViewer,
    ConfirmationToggle,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/components/blocks.scss";

.well {
  padding-bottom: 0;
}

h2 {
  display: inline-block;
}

h5 {
  margin-bottom: 20px;
  text-decoration: underline;
}

table {
  td {
    max-width: 300px;
  }
}

a {
  .icon-trash {
    color: $appred;
  }

  &:hover {
    .icon-trash {
      color: $appred;
    }
  }

  &.edit-module {
    &:hover {
      text-decoration: none;
    }
  }
}

.edit-module {
  i {
    margin-left: 10px;
    font-size: 20px;
    color: black;
  }
}

.btn-url {
  margin-bottom: 20px;

  &.add-new {
    margin-left: 10px;
    display: block;
    margin-bottom: 20px;
  }
}

.confirmation-small {
  margin-right: 5px;
}

input {
  border: 1px solid $appgrey;
  border-radius: 5px;
  font-size: 14px;
  padding: 3px 10px;
  float: right;
  margin-bottom: 5px;
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
