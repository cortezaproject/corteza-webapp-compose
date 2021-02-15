"<template>
  <div class="py-3">
    <b-container>
      <b-row no-gutters>
        <h1>{{ $t('module.title') }}</h1>
        <b-col md="12">
<!--          <b-card class="mb-2">-->
<!--            <b-row align-v="center">-->
<!--              <b-col md="5">-->
<!--                <b-form v-if="namespace.canCreateModule"-->
<!--                      @submit.prevent="create">-->
<!--                  <b-form-group>-->
<!--                    <b-input-group>-->
<!--                      <b-input required type="text"-->
<!--                               v-model="newModule.name"-->
<!--                               id="name"-->
<!--                               :placeholder="$t('module.newPlaceholder')" />-->
<!--                      <b-input-group-append>-->
<!--                        <b-button type="submit" variant="primary">{{ $t('general.label.create') }}</b-button>-->
<!--                      </b-input-group-append>-->
<!--                    </b-input-group>-->
<!--                  </b-form-group>-->
<!--                </b-form>-->
<!--              </b-col>-->
<!--              <b-col md="5">-->
<!--                <import v-if="namespace.canCreateModule"-->
<!--                        :namespace="namespace"-->
<!--                        variant="primary"-->
<!--                        type="module" />-->
<!--              </b-col>-->
<!--            </b-row>-->
<!--          </b-card>-->
          <b-card no-body>
            <b-card-header header-bg-variant="white">
              <b-button type="submit" variant="primary" size="lg">{{ $t('general.label.create') }}</b-button>
              <b-button type="submit" variant="light" size="lg" class="ml-1">Import</b-button>
              <export :list="modules" type="module" class="ml-1"/>
              <c-permissions-button
                v-if="namespace.canGrant"
                resource="compose:module:*"
                class="float-right mt-1"
                link
              />
            </b-card-header>
            <b-card-body class="p-0">
              <b-table
                :fields="tableFields"
                :items="modules"
                @row-clicked="handleRowClicked"
                head-variant="light"
                tbody-tr-class="pointer"
                responsive
                hover
              >
                <template v-slot:cell(name)="{ item: m }">
                  <div>
                    {{ m.name }}
                    <h5
                      class="mb-0"
                    >
                      <b-badge
                        v-if="Object.keys(m.labels || {}).includes('federation')"
                        pill
                        variant="primary"
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
                    class="mr-2 pt-0"
                  >
                    {{ pages.find(p => p.moduleID === m.moduleID) ?  $t('module.recordPage.edit') : $t('module.recordPage.create') }}
                  </b-button>
                  <span v-if="m.canReadRecord">
                    <router-link :to="{name: 'admin.modules.record.list', params: { moduleID: m.moduleID }}" class="mr-2 text-dark">
                      <font-awesome-icon :icon="['fas', 'bars']"></font-awesome-icon>
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
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { compose } from '@cortezaproject/corteza-js'
// import Import from 'corteza-webapp-compose/src/components/Admin/Import'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'

export default {
  name: 'ModuleList',

  components: {
    // Import,
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
          tdClass: 'align-middle',
        },
        {
          key: 'handle',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: 'updatedAt',
          sortable: true,
          tdClass: 'align-middle',
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
      const blocks = [new compose.PageBlockRecord({ xywh: [0, 0, 12, 16] })]
      const selfID = (this.pages.find(p => {
        return p.blocks.find(b => b.options.moduleID === module.moduleID)
      }) || {}).pageID

      const payload = {
        namespaceID,
        title: `${this.$t('module.forModule.recordPage')} "${module.name || moduleID}"`,
        moduleID,
        blocks,
        selfID,
      }

      // Create page and open it
      this.createPage(payload)
        .then(page => {
          this.$router.push(goto(page))
        })
        .catch(this.defaultErrorHandler(this.$t('notification.page.createFailed')))
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
