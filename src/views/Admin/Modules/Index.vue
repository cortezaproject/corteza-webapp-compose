<template>
  <div class="py-3">
    <b-container>
      <b-row>
        <b-col md="12">
          <b-card class="mb-2">
            <b-row align-v="center">
              <b-col md="5">
                <b-form v-if="namespace.canCreateModule"
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
                </b-form>
              </b-col>
              <b-col md="5">
                <import v-if="namespace.canCreateModule"
                        :namespace="namespace"
                        variant="primary"
                        type="module" />
              </b-col>
              <b-col md="2" class="text-right">
                <export :list="sortedModules" type="module" />
                <c-permissions-button v-if="namespace.canGrant"
                                    resource="compose:module:*"
                                    link />
              </b-col>
            </b-row>
          </b-card>
          <b-card :title="$t('module.title')">
            <table class="table table-striped">
              <thead>
                <tr>
                  <table-sortable-column
                    :label="$t('general.label.name')"
                    name="name"
                    :ascending="sortedByName"
                    @sort="handleSort"/>

                  <table-sortable-column
                    :label="$t('general.label.handle')"
                    name="handle"
                    :ascending="sortedByHandle"
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
                <tr
                  v-for="(m, index) in sortedModules"
                  :key="index"
                  @click.prevent="openEditor(m)"
                >
                  <td
                  >
                    {{ m.name }}
                  </td>
                  <td class="align-middle">
                    {{ m.handle }}
                  </td>
                  <td class="align-middle"><time :datetime="m.updatedAt" v-if="m.updatedAt">{{ prettyDate(m.updatedAt || m.createdAt) }}</time></td>
                  <td
                    @click.prevent.stop
                    class="text-right"
                  >
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
                        <font-awesome-icon :icon="['far', 'edit']"></font-awesome-icon>
                      </router-link>
                    </span>
                    <c-permissions-button v-if="m.canGrant" :title="m.name" :resource="'compose:module:'+m.moduleID" link />
                  </td>
                </tr>
              </tbody>
            </table>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { compose } from '@cortezaproject/corteza-js'
import TableSortableColumn from 'corteza-webapp-compose/src/components/Admin/TableSortableColumn'
import tableSort from 'corteza-webapp-compose/src/mixins/table_sort'
import Import from 'corteza-webapp-compose/src/components/Admin/Import'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'

export default {
  name: 'ModuleList',

  components: {
    TableSortableColumn,
    Import,
    Export,
  },

  mixins: [
    tableSort,
  ],

  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },
  },

  data () {
    return {
      newModule: new compose.Module(
        { fields: [new compose.ModuleFieldString({ fieldID: '0', name: 'Sample' })] },
        this.namespace,
      ),
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

    sortedByHandle () {
      return this.isSortedBy('handle', true)
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
      this.createModule(this.newModule)
        .then((module) => this.openEditor(module))
        .catch(this.defaultErrorHandler(this.$t('notification.module.createFailed')))
    },

    openEditor (module) {
      const { moduleID } = module
      this.$router.push({ name: 'admin.modules.edit', params: { moduleID } })
    },

    handleRecordPageCreation ({ moduleID }) {
      // This is called from record pages list as a request to create a (record) page that
      // with reference to a module

      const module = this.modules.find(m => m.moduleID === moduleID)
      const { namespaceID } = this.namespace
      const payload = {
        namespaceID,
        title: `${this.$t('module.forModule.recordPage')} "${module.name || moduleID}"`,
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
table {
  tr {
    cursor: pointer;
  }
}
</style>
