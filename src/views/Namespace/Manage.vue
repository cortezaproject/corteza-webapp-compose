<template>
  <div
    class="d-flex w-100 overflow-auto"
  >
    <portal to="topbar-title">
      {{ $t('title') }}
    </portal>
    <portal to="topbar-tools">
      <b-btn
        data-test-id="public-view"
        variant="primary"
        size="sm"
        class="mr-1 float-left"
        :to="{ name: 'namespace.list' }"
      >
        {{ $t('list-view') }}
      </b-btn>
    </portal>

    <b-container
      class="ns-wrapper"
      fluid="xl"
    >
      <b-row
        class="my-3"
        no-gutters
      >
        <b-card
          no-body
          class="w-100"
        >
          <b-card-header
            header-bg-variant="white"
          >
            <b-row
              class="wrap-with-vertical-gutters"
              no-gutters
            >
              <div
                class="flex-grow-1"
              >
                <div
                  class="wrap-with-vertical-gutters"
                >
                  <b-btn
                    v-if="canCreate"
                    data-test-id="button-create"
                    :to="{ name: 'namespace.create' }"
                    variant="primary"
                    size="lg"
                    class="mr-1 float-left"
                  >
                    {{ $t('toolbar.buttons.create') }}
                  </b-btn>

                  <importer-modal
                    v-if="canImport"
                    class="mr-1 float-left"
                    @imported="onImported"
                    @failed="onFailed"
                  />

                  <c-permissions-button
                    v-if="canGrant"
                    resource="corteza::compose:namespace/*"
                    button-variant="light"
                    :button-label="$t('toolbar.buttons.permissions')"
                    class="btn-lg float-left"
                  />
                </div>
              </div>
              <div class="flex-grow-1">
                <c-input-search
                  v-model.trim="query"
                  :placeholder="$t('toolbar.search.placeholder')"
                />
              </div>
            </b-row>
          </b-card-header>
          <b-table
            :fields="namespacesFields"
            :items="namespaces"
            :filter="query"
            :empty-text="$t('noResults')"
            head-variant="light"
            tbody-tr-class="pointer"
            class="position-relative"
            responsive
            show-empty
            hover
            @row-clicked="handleRowClicked"
          >
            <template #cell(name)="{ item }">
              {{ item.name }}
              <b-badge
                v-if="!item.enabled"
                variant="warning"
              >
                {{ $t('disabled') }}
              </b-badge>
            </template>
            <template #cell(lastChange)="{ item }">
              {{ (item.updatedAt || item.createdAt) | locFullDateTime }}
            </template>
          </b-table>
        </b-card>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ImporterModal from 'corteza-webapp-compose/src/components/Namespaces/Importer'
import { components } from '@cortezaproject/corteza-vue'
const { CInputSearch } = components

export default {
  i18nOptions: {
    namespaces: 'namespace',
    keyPrefix: 'manage',
  },

  components: {
    ImporterModal,
    CInputSearch,
  },

  data () {
    return {
      query: '',
    }
  },

  computed: {
    ...mapGetters({
      namespaces: 'namespace/set',
      can: 'rbac/can',
    }),

    canGrant () {
      return this.can('compose/', 'grant')
    },

    canCreate () {
      return this.can('compose/', 'namespace.create')
    },

    canImport () {
      // If a user is allowed to create a namespace, they are considered to be allowed
      // to create any underlying resource when it comes to importing.
      //
      // This was agreed upon internally and may change in the future.

      return this.can('compose/', 'namespace.create')
    },

    importNamespaceEndpoint () {
      return this.$ComposeAPI.namespaceImportEndpoint({})
    },

    namespacesFiltered () {
      return this.namespaces.filter(ns => {
        const query = this.query.toLowerCase()
        return (ns.slug).toLowerCase().indexOf(query) > -1 || (ns.name).toLowerCase().indexOf(query) > -1
      })
    },

    namespacesFields () {
      return [
        {
          key: 'name',
          sortable: true,
          label: this.$t('table.columns.name'),
        },
        {
          key: 'slug',
          sortable: true,
          class: 'text-nowrap',
          label: this.$t('table.columns.handle'),
        },
        {
          key: 'lastChange',
          sortable: true,
          class: 'text-nowrap',
          label: this.$t('table.columns.last-change'),
        },
      ]
    },
  },

  methods: {
    onImported () {
      this.$store.dispatch('namespace/load', { force: true })
        .then(() => this.toastSuccess(this.$t('notification:namespace.imported')))
        .catch(this.toastErrorHandler(this.$t('notification:namespace.importFailed')))
    },

    onFailed (err) {
      this.toastErrorHandler(this.$t('notification:namespace.importFailed'))(err)
    },

    handleRowClicked ({ namespaceID }) {
      this.$router.push({
        name: 'namespace.edit',
        params: { namespaceID },
      })
    },
  },
}
</script>
