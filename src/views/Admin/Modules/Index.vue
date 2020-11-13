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
                <export :list="modules" type="module" />
                <c-permissions-button
                  v-if="namespace.canGrant"
                  resource="compose:module:*"
                  link
                />
              </b-col>
            </b-row>
          </b-card>
          <b-card :title="$t('module.title')">
            <b-table
              :fields="tableFields"
              :items="modules"
              striped
              borderless
              responsive
            >
              <template v-slot:cell(name)="{ item: m }">
                <div
                  class="d-flex justify-content-between"
                >
                  {{ m.name }}
                  <h5
                    class="mb-0"
                  >
                    <b-badge
                      v-if="Object.keys(m.labels || {}).includes('federation')"
                      pill
                      variant="primary"
                      class="m-1 py-1 px-2"
                      style="border-radius: 0.5rem;"
                    >
                      {{ $t('module.federated') }}
                    </b-badge>
                  </h5>
                </div>
              </template>
              <template v-slot:cell(updatedAt)="{ item: m }">
                {{ (m.updatedAt || m.createdAt) | locDateOnly }}
              </template>
              <template v-slot:cell(actions)="{ item: m }">
                <b-button
                  @click="openPageBuilder(m)"
                  variant="link"
                  class="mr-2 pt-0 text-dark"
                >
                  {{ pages.find(p => p.moduleID === m.moduleID) ?  $t('module.recordPage.edit') : $t('module.recordPage.create') }}
                </b-button>
                <span v-if="m.canReadRecord">
                  <router-link :to="{name: 'admin.modules.record.list', params: { moduleID: m.moduleID }}" class="mr-2 text-dark">
                    <font-awesome-icon :icon="['fas', 'bars']"></font-awesome-icon>
                  </router-link>
                </span>
                <span v-if="m.canUpdateModule || m.canDeleteModule">
                  <router-link :to="{name: 'admin.modules.edit', params: { moduleID: m.moduleID }}" class="mr-2 text-dark">
                    <font-awesome-icon :icon="['far', 'edit']"></font-awesome-icon>
                  </router-link>
                </span>
                <c-permissions-button
                  v-if="m.canGrant"
                  :title="m.name"
                  :target="m.name"
                  :resource="'compose:module:'+m.moduleID"
                  link
                />
              </template>
            </b-table>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { compose } from '@cortezaproject/corteza-js'
import Import from 'corteza-webapp-compose/src/components/Admin/Import'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'

export default {
  name: 'ModuleList',

  components: {
    Import,
    Export,
  },

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

    tableFields () {
      return [
        {
          key: 'name',
          sortable: true,
        },
        {
          key: 'handle',
          sortable: true,
        },
        {
          key: 'updatedAt',
          sortable: true,
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ]
    },

    recordPage () {
      return (moduleID) => this.pages.find(p => p.moduleID === moduleID)
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

    openPageBuilder ({ moduleID }) {
      // Create params for $router.push
      const goto = ({ pageID }) => {
        return {
          name: 'admin.pages.builder',
          params: { pageID },
        }
      }

      const recordPage = this.pages.find(p => p.moduleID === moduleID)
      if (recordPage) {
        // Record page already exists
        this.$router.push(goto(recordPage))
        return
      }

      // Collect params and create new record page
      const module = this.modules.find(m => m.moduleID === moduleID)
      const { namespaceID } = this.namespace

      // Get recordList page if it exists
      const selfID = (this.pages.find(p => {
        return p.blocks.find(b => b.options.moduleID === module.moduleID)
      }) || {}).pageID

      const payload = {
        namespaceID,
        title: `${this.$t('module.forModule.recordPage')} "${module.name || moduleID}"`,
        moduleID,
        blocks: [],
        selfID,
      }

      // Create page and open it
      this.createPage(payload)
        .then(page => {
          this.$router.push(goto(page))
        })
        .catch(this.defaultErrorHandler(this.$t('notification.page.createFailed')))
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
