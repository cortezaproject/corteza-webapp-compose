<template>
  <div class="scrollable">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well table-responsive">
<<<<<<< HEAD
            <permissions-button v-if="namespace.canGrant"
                                resource="compose:module:*"
                                class="float-right"
                                link />
            <h2>{{ $t('module.title')}}</h2>
=======
            <div class="title-bar">
              <h2>{{ $t('module.title')}}</h2>
              <div class="title-actions actions">
                <permissions-button v-if="namespace.canGrant" resource="compose:module:*" link />
                <button @click="jsonExport(modules, 'module')">
                  <font-awesome-icon :icon="['fas', 'file-export']"></font-awesome-icon>
                </button>

                <permissions-button resource="compose:module:*" link />
              </div>
            </div>
>>>>>>> Implement export function
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
                    <router-link :to="{name: 'admin.modules.edit', params: { moduleID: m.moduleID }}"
                                 class="text-dark">{{ m.name }}</router-link>
                  </td>
                  <td><time :datetime="m.updatedAt" v-if="m.updatedAt">{{ prettyDate(m.updatedAt || m.createdAt) }}</time></td>
                  <td class="text-right">
                    <b-button
                      v-if="recordPage(m.moduleID)"
                      :to="{name: 'admin.pages.builder', params: { pageID: recordPage(m.moduleID).pageID }}"
                      variant="link"
                      class="mr-2 text-dark">{{ $t('general.label.pageBuilder') }}</b-button>
                    <b-button
                       v-else
                       @click="handleRecordPageCreation({ moduleID: m.moduleID })"
                       variant="link"
                       class="mr-2 text-dark">{{ $t('general.label.pageBuilder') }}</b-button>
                    <span v-if="m.canUpdateModule || m.canDeleteModule">
                      <router-link :to="{name: 'admin.modules.edit', params: { moduleID: m.moduleID }}" class="mr-2 text-dark">
                       <i class="icon-edit"></i>
                      </router-link>
                    </span>
                    <permissions-button v-if="m.canGrant" :title="m.name" :resource="'compose:module:'+m.moduleID" link />
                  </td>
                </tr>
              </tbody>
            </table>
            <form v-if="namespace.canCreateModule"
                  class="mt-4"
                  @submit.prevent="create">
              <b-form-group :label="$t('module.newLabel')">
                <b-input-group>
                  <b-input required type="text"
                         v-model="newModule.name"
                         id="name"
                         :placeholder="$t('module.newPlaceholder')" />
                  <b-input-group-append>
                    <b-button type="submit" variant="dark">{{ $t('general.label.create') }}</b-button>
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
import { saveAs } from 'file-saver'

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
      newModule: new Module({ namespaceID, fields: [new Field({ fieldID: '0', name: 'sample', kind: 'String' })] }),
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

    jsonExport (list, type) {
      let blob = new Blob([JSON.stringify({ type, list: list.map(m => m.export()) })], { type: 'application/json' })
      saveAs(blob, 'modules-export.json')
    },

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
