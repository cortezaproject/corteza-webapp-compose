<template>
  <div class="scrollable">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well table-responsive">
            <h2>{{ $t('module.title')}}</h2>
            <table class="table table-striped">
              <thead>
                <tr>
                  <table-sortable-column
                    :label="$t('general.label.name')"
                    name="name"
                    :ascending="sortedByName"
                    @sort="handleSort"/>

                  <table-sortable-column
                    :label="$t('general.label.updatedAt')"
                    name="updatedAt"
                    :ascending="sortedByUpdatedAt"
                    @sort="handleSort"/>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(m, index) in sortedModules" :key="index">
                  <td>
                    <router-link :to="{name: 'admin.modules.edit', params: { moduleID: m.moduleID }}" class="btn-url">{{ m.name }}</router-link>
                  </td>
                  <td><time :datetime="m.updatedAt" v-if="m.updatedAt">{{ prettyDate(m.updatedAt || m.createdAt) }}</time></td>
                  <td class="actions text-right">
                    <router-link
                      v-if="recordPage(m.moduleID)"
                      :to="{name: 'admin.pages.builder', params: { pageID: recordPage(m.moduleID).pageID }}"
                      class="btn-url">{{ $t('general.label.pageBuilder') }}</router-link>
                    <button
                       v-else
                       @click="handleRecordPageCreation({ moduleID: m.moduleID })"
                       class="btn-url">{{ $t('general.label.pageBuilder') }}</button>

                    <router-link :to="{name: 'admin.modules.edit', params: { moduleID: m.moduleID }}" class="action">
                      <i class="action icon-edit"></i>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
            <form @submit.prevent="create">
              <b-form-group :label="$t('module.newLabel')">
                <b-input-group>
                  <input required type="text" v-model="newModule.name" class="form-control" id="name" :placeholder="$t('module.newPlaceholder')" />
                  <b-input-group-append>
                    <button type="submit" class="btn btn-dark">{{ $t('general.label.create') }}</button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Field from '@/lib/field'
import Module from '@/lib/module'
import TableSortableColumn from '@/components/Admin/TableSortableColumn'
import tableSort from '@/mixins/table_sort'

export default {
  name: 'ModuleList',

  components: {
    TableSortableColumn,
  },

  mixins: [
    tableSort,
  ],

  props: {
    namespace: {
      type: Object,
      required: false,
    },
  },

  data () {
    const { namespaceID } = this.namespace

    return {
      newModule: new Module({ namespaceID, fields: [new Field({ name: 'sample', kind: 'String' })] }),
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
      pages: 'page/set',
    }),

    recordPage () {
      return (moduleID) => this.pages.find(p => p.moduleID === moduleID)
    },

    sortedByName () {
      return this.isSortedBy('name', true)
    },

    sortedByUpdatedAt () {
      return this.isSortedBy('updatedAt')
    },

    sortedModules () {
      return this.sortedItems([...this.modules])
    },
  },

  methods: {
    ...mapActions({
      createModule: 'module/create',
      createPage: 'page/create',
    }),

    create () {
      this.createModule(this.newModule).then((module) => {
        this.$router.push({ name: 'admin.modules.edit', params: { moduleID: module.moduleID } })
      }).catch(this.defaultErrorHandler(this.$t('notification.module.createFailed')))
    },

    handleRecordPageCreation ({ moduleID }) {
      // This is called from record pages list as a request to create a (record) page that
      // with reference to a module

      const module = this.modules.find(m => m.moduleID === moduleID)
      const { namespaceID } = this.namespace
      const payload = {
        namespaceID,
        title: `${this.$t('module.recordPage')} "${module.name || moduleID}"`,
        moduleID,
        blocks: [],
      }

      this.createPage(payload).then(page => {
        this.$router.push({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
      }).catch(this.defaultErrorHandler(this.$t('notification.page.createFailed')))
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

.btn {
  border-radius: 0;
}

.table {
  td {
    min-width: 100px;
    border-top: 0;
  }
}

form {
  margin-top: 50px;
}
</style>
