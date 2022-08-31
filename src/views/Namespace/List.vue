<template>
  <div
    class="d-flex w-100 overflow-auto"
  >
    <portal to="topbar-title">
      {{ $t('title') }}
    </portal>

    <b-container
      class="ns-wrapper"
      fluid="xl"
    >
      <b-row
        class="wrap-with-vertical-gutters"
        no-gutters
      >
        <b-col>
          <b-btn
            data-test-id="button-create"
            variant="white"
            size="lg"
            class="mr-1 float-left"
          >
            *! Manage namespaces
          </b-btn>
        </b-col>
        <b-col
          md="8"
          lg="6"
        >
          <c-input-search
            v-model.trim="query"
            :placeholder="$t('searchPlaceholder')"
          />
        </b-col>
      </b-row>
      <transition-group
        v-if="namespacesFiltered && namespacesFiltered.length"
        name="namespace-list"
        tag="div"
        class="row my-3 card-deck no-gutters"
      >
        <namespace-item
          v-for="n in namespacesFiltered"
          :key="n.namespaceID"
          :namespace="n"
        />
      </transition-group>

      <div
        v-else
        class="d-flex justify-content-center align-items-center h-50 w-100"
      >
        <h3
          class="text-left"
        >
          {{ $t('noResults') }}
        </h3>
      </div>

      <b-row
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
                    data-test-id="button-create"
                    :to="{ name: 'namespace.create' }"
                    variant="primary"
                    size="lg"
                    class="mr-1 float-left"
                  >
                    {{ $t('create') }}
                  </b-btn>

                  <importer-modal
                    class="mr-1 float-left"
                    @imported="onImported"
                    @failed="onFailed"
                  />

                  <c-permissions-button
                    v-if="canGrant"
                    resource="corteza::compose:namespace/*"
                    button-variant="light"
                    :button-label="$t('label.permissions')"
                    class="btn-lg float-left"
                  />
                </div>
              </div>
              <div class="flex-grow-1">
                <c-input-search
                  v-model.trim="query"
                  :placeholder="$t('searchPlaceholder')"
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
            <template #cell(createdAt)="row">
              {{ row.item.createdAt | locFullDateTime }}
            </template>
            <template #cell(updatedAt)="row">
              {{ row.item.updatedAt | locFullDateTime }}
            </template>
          </b-table>
        </b-card>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import NamespaceItem from 'corteza-webapp-compose/src/components/Namespaces/NamespaceItem'
import ImporterModal from 'corteza-webapp-compose/src/components/Namespaces/Importer'
import { components } from '@cortezaproject/corteza-vue'
const { CInputSearch } = components

export default {
  i18nOptions: {
    namespaces: 'namespace',
  },

  components: {
    NamespaceItem,
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

    canCreateNamespace () {
      return this.can('compose/', 'namespace.create')
    },

    canImportNamespace () {
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
        },
        {
          key: 'slug',
          label: 'Short name',
          sortable: true,
          class: 'text-nowrap',
        },
        {
          key: 'meta.subtitle',
          label: 'Subtitle',
          sortable: true,
        },
        {
          key: 'meta.description',
          label: 'Description',
          sortable: true,
        },
        {
          key: 'createdAt',
          sortable: true,
          class: 'text-nowrap',
        },
        {
          key: 'updatedAt',
          sortable: true,
          class: 'text-nowrap',
        },
        {
          key: 'enabled',
          sortable: true,
          formatter: (v) => v ? 'Yes' : 'No',
        },
        {
          key: 'meta.logoEnabled',
          label: 'Logo uploaded',
          sortable: true,
          formatter: (v) => v ? 'Yes' : 'No',
        },
      ]
    },
  },

  mounted () {
    document.title = this.$t('general:label.app-name.public')
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

    handleRowClicked ({ namespace }) {
      this.$router.push({
        name: 'namespace.edit',
        params: { namespaceID: namespace.namespaceID },
      })
    },
  },
}
</script>
