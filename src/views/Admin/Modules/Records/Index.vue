<template>
  <section class="container well" id="modules-contents-index" v-if="module">
    <router-link :to="{name: 'admin.modules'}" class="btn btn-url">Back to Module list</router-link><br>
    <h2>{{module.name}}</h2>
    <router-link :to="{name: 'admin.modules.edit', params: { moduleID }}" class="edit-module">
    <i class="icon-edit"></i>
    </router-link>
    <hr />
    <input @keypress.enter.prevent="handleQuery($event.target.value)" />
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
              <confirmation-toggle @confirmed="handleDelete(row.contentID)" class="confirmation" cta-class="btn-url">
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
    <div>
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

    <router-link :to="{name: 'admin.modules.records.add', params: { moduleID }}" class="btn btn-primary">Add new entry</router-link>
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

      errors: [],
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
    }).catch(({ message }) => {
      this.errors = [message]
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

    handleDelete (recordID) {
      this.$crm.moduleContentDelete({ moduleID: this.moduleID, contentID: recordID }).then(r => {
        this.fetch()
      }).catch(({ message }) => {
        this.error = [message]
      })
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

  &::before {
    content: "< ";
  }
}

.confirmation{
  margin-right: 5px;
}

</style>
