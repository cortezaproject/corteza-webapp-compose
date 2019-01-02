<template>
  <section class="container well" id="modules-content-index" v-if="module">
    <router-link :to="{name: 'admin.modules'}" class="btn btn-url">&#171; Back to module list</router-link><br>
    <h2>{{module.name}}</h2>
    <router-link :to="{name: 'admin.modules.edit', params: { moduleID }}" class="edit-module">
    <i class="icon-edit"></i>
    </router-link>
    <hr />
    <input @keyup.enter.prevent="handleQuery"
           @keyup="handleQueryThrottled"
           v-model="query"
           placeholder="Search" />
    <table class="table sticky-header">
      <thead>
        <tr>
          <th v-for="col in module.meta.admin.recordList.columns" :key="col.name" @click="handleSort(col.name)">
            {{col.label || col.name}}
          </th>
          <th class="text-right">
            <button @click.prevent="adminRecordListSettingsModal=true"
                    class="btn-url"><font-awesome-icon :icon="['fas', 'wrench']"></font-awesome-icon></button>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in records">
          <tr :key="row.recordID">
            <td v-for="col in module.meta.admin.recordList.columns" :key="'modules-contents-' + row.recordID + '-' + col.name">
              <field-viewer :field="col" :record="row" value-only />
            </td>
            <td class="text-right actions">
              <confirmation-toggle @confirmed="handleDelete(row.recordID)" class="confirmation-small" cta-class="btn-url">
                <i class="action icon-trash"></i>
              </confirmation-toggle>
              <router-link :to="{name: 'admin.modules.records.edit', params: { moduleID, recordID: row.recordID }}">
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

    <b-modal
      v-if="module.meta.admin.recordList.columns"
      title="Admin record list settings"
      ok-title="Save and close"
      ok-variant="dark"
      ok-only
      @ok="handleModuleUpdate()"
      @hide="adminRecordListSettingsModal=false"
      :visible="adminRecordListSettingsModal">
      <field-selector :module="module"
                      :fields.sync="module.meta.admin.recordList.columns"></field-selector>
    </b-modal>
  </section>
</template>

<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import FieldViewer from '@/lib/field/Viewer'
import Module from '@/lib/module'
import Pagination from 'vue-pagination-2'
import FieldSelector from '@/lib/block/BuilderEdit/inc/FieldSelector'
import _ from 'lodash'

export default {
  props: {
    moduleID: String,
  },
  data () {
    return {
      adminRecordListSettingsModal: false,

      query: null,

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

  mounted () {
    this.$crm.moduleRead({ moduleID: this.moduleID }).then(m => {
      this.module = new Module(m)
      return this.fetch()
    }).catch(this.defaultErrorHandler('Could not load record\'s module'))
  },

  methods: {
    fetch (params = this.meta) {
      this.$router.push({ query: params })

      params.moduleID = this.module.moduleID

      return this.$crm.moduleRecordList(params).then(({ meta, records }) => {
        this.meta = meta
        this.records = records
      }).catch(this.defaultErrorHandler('Could not load this record'))
    },

    handleQueryThrottled: _.throttle(function (e) { this.handleQuery(e) }, 500),

    handleQuery () {
      let filter

      if (this.query.trim().length > 0) {
        // Is this number we're searching?
        const numQuery = Number.parseFloat(this.query)

        // Replace * wildcard with SQL's % and append on at the end to enable
        // fixed-prefix search by default
        const strQuery = this.query.replace('*', '%') + '%'

        filter = this.module.fields.map(qf => {
          if (qf.kind === 'Number' && !numQuery.isNaN()) {
            return `${qf.name} = ${numQuery}`
          }

          if (['String', 'DateTime', 'Select', 'Url', 'Email'].includes(qf.kind)) {
            return `${qf.name} LIKE '${strQuery}'`
          }
        }).filter(q => !!q).join(' OR ')
      }

      this.fetch({ ...this.meta, filter })
    },

    handleSort (fieldName) {
      this.fetch({ ...this.meta, sort: this.meta.sort === fieldName ? fieldName + ' DESC' : fieldName })
    },

    handlePageChange (page) {
      this.fetch({ ...this.meta, page: page - 1 })
    },

    handleDelete (recordID) {
      this.$crm.moduleRecordDelete({ moduleID: this.moduleID, recordID: recordID }).then(r => {
        this.raiseSuccessAlert('Record deleted')
        this.fetch()
      }).catch(this.defaultErrorHandler('Could not delete this record'))
    },

    handleModuleUpdate () {
      this.$crm.moduleEdit(this.module).then(() => {
        this.raiseSuccessAlert('Module saved')
      }).catch(this.defaultErrorHandler('Could not save changes'))
    },
  },

  components: {
    Pagination,
    FieldViewer,
    ConfirmationToggle,
    FieldSelector,
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

#modules-content-index {
  overflow-y: scroll;
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
