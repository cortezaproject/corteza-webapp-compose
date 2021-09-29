"<template>
  <div class="py-3">
    <portal to="topbar-title">
      {{ $t('navigation.module') }}
    </portal>

    <b-container fluid="xl">
      <b-row no-gutters>
        <b-col>
          <b-card
            no-body
            class="shadow-sm"
          >
            <b-card-header
              header-bg-variant="white"
              class="py-3"
            >
              <b-row
                class="align-items-center justify-content-between"
                no-gutters
              >
                <div class="flex-grow-1">
                  <b-btn
                    v-if="namespace.canCreateModule"
                    variant="primary"
                    size="lg"
                    class="mr-1 float-left"
                    :to="{ name: 'admin.modules.create' }"
                  >
                    {{ $t('createLabel') }}
                  </b-btn>

                  <import
                    v-if="namespace.canCreateModule"
                    :namespace="namespace"
                    type="module"
                    class="mr-1 float-left"
                  />

                  <export
                    :list="modules"
                    type="module"
                    class="mr-1 float-left"
                  />

                  <b-dropdown
                    v-if="namespace.canGrant"
                    size="lg"
                    variant="light"
                    class="permissions-dropdown"
                  >
                    <template #button-content>
                      <font-awesome-icon :icon="['fas', 'lock']" />
                      <span>
                        {{ $t('general:label.permissions') }}
                      </span>
                    </template>

                    <b-dropdown-item>
                      <c-permissions-button
                        :resource="`corteza::compose:module/${namespace.namespaceID}/*`"
                        :button-label="$t('general:label.module')"
                        :show-button-icon="false"
                        button-variant="white w-100"
                      />
                    </b-dropdown-item>

                    <b-dropdown-item>
                      <c-permissions-button
                        :resource="`corteza::compose:module-field/${namespace.namespaceID}/*`"
                        :button-label="$t('general:label.field')"
                        :show-button-icon="false"
                        button-variant="white w-100"
                      />
                    </b-dropdown-item>

                    <b-dropdown-item>
                      <c-permissions-button
                        :resource="`corteza::compose:record/${namespace.namespaceID}/*`"
                        :button-label="$t('general:label.record')"
                        :show-button-icon="false"
                        button-variant="white w-100"
                      />
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
                <div class="flex-grow-1">
                  <b-input-group>
                    <b-input
                      v-model.trim="query"
                      class="mw-100"
                      type="search"
                      :placeholder="$t('searchPlaceholder')"
                    />
                    <b-input-group-append>
                      <b-input-group-text class="text-primary bg-white">
                        <font-awesome-icon
                          :icon="['fas', 'search']"
                        />
                      </b-input-group-text>
                    </b-input-group-append>
                  </b-input-group>
                </div>
              </b-row>
            </b-card-header>
            <b-card-body class="p-0">
              <b-table
                :fields="tableFields"
                :items="modules"
                :filter="query"
                :filter-included-fields="['handle', 'name']"
                :sort-by.sync="sortBy"
                :sort-desc="sortDesc"
                head-variant="light"
                tbody-tr-class="pointer"
                :empty-text="$t('noModule')"
                :empty-filtered-text="$t('noModuleFilter')"
                responsive
                show-empty
                hover
                @row-clicked="handleRowClicked"
              >
                <template v-slot:cell(name)="{ item: m }">
                  <div
                    class="d-flex align-items-center"
                  >
                    {{ m.name }}
                    <h5
                      class="ml-2 mb-0"
                    >
                      <b-badge
                        v-if="Object.keys(m.labels || {}).includes('federation')"
                        pill
                        variant="primary"
                      >
                        {{ $t('federated') }}
                      </b-badge>
                    </h5>
                  </div>
                </template>
                <template v-slot:cell(updatedAt)="{ item: m }">
                  {{ (m.updatedAt || m.createdAt) | locDate }}
                </template>
                <template v-slot:cell(actions)="{ item: m }">
                  <b-button
                    variant="light"
                    class="mr-2"
                    @click="openPageBuilder(m)"
                  >
                    {{ pages.find(p => p.moduleID === m.moduleID) ? $t('recordPage.edit') : $t('recordPage.create') }}
                  </b-button>
                  <span>
                    <router-link
                      :to="{name: 'admin.modules.record.list', params: { moduleID: m.moduleID }}"
                      class="btn px-2 text-dark"
                    >
                      {{ $t('allRecords.label') }}
                    </router-link>
                  </span>
                  <c-permissions-button
                    v-if="m.canGrant"
                    :title="m.name"
                    :target="m.name"
                    :resource="`corteza::compose:module/${m.namespaceID}/${m.moduleID}`"
                    class="btn px-2"
                    link
                  />
                </template>
              </b-table>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { compose, fmt } from '@cortezaproject/corteza-js'
import Import from 'corteza-webapp-compose/src/components/Admin/Import'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'

export default {
  i18nOptions: {
    namespaces: 'module',
  },

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
      query: '',

      sortBy: 'name',
      sortDesc: false,

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
          tdClass: 'align-middle pl-4 text-nowrap',
          thClass: 'pl-4',
        },
        {
          key: 'handle',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: 'updatedAt',
          sortable: true,
          sortByFormatted: true,
          tdClass: 'align-middle',
          class: 'text-right',
          formatter: (updatedAt, key, item) => {
            return fmt.date(updatedAt || item.createdAt)
          },
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
      createPage: 'page/create',
    }),

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
      const blocks = [new compose.PageBlockRecord({ xywh: [0, 0, 12, 16] })]
      const selfID = (this.pages.find(p => {
        return p.blocks.find(b => b.options.moduleID === module.moduleID)
      }) || {}).pageID

      const payload = {
        namespaceID,
        title: `${this.$t('forModule.recordPage')} "${module.name || moduleID}"`,
        moduleID,
        blocks,
        selfID,
      }

      // Create page and open it
      this.createPage(payload)
        .then(page => {
          this.$router.push(goto(page))
        })
        .catch(this.toastErrorHandler(this.$t('notification.page.createFailed')))
    },

    handleRowClicked ({ moduleID, canUpdateModule, canDeleteModule }) {
      if (!(canUpdateModule || canDeleteModule)) {
        return
      }
      this.$router.push({
        name: 'admin.modules.edit',
        params: { moduleID },
        query: null,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
$input-height: 42px;

.module-name-input {
  height: $input-height;
}
</style>

<style lang="scss">
.permissions-dropdown {
  .dropdown-item {
    padding: 0;
  }
}
</style>
