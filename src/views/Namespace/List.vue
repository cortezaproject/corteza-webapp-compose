<template>
  <div
    v-if="loaded"
    class="d-flex w-100 overflow-auto"
  >
    <portal to="topbar-title">
      {{ $t('namespace.title') }}
    </portal>

    <b-container
      class="ns-wrapper"
      fluid="xl"
    >
      <b-row
        no-gutters
        class="align-items-center justify-content-between"
      >
        <div
          v-if="canCreateNamespace"
          class="flex-grow-1"
        >
          <b-btn :to="{ name: 'namespace.create' }"
                 variant="primary"
                 size="lg"
          >
              {{ $t('namespace.create') }}
          </b-btn>
          <c-permissions-button
            v-if="canGrant"
            resource="compose:namespace:*"
            buttonVariant="light"
            :buttonLabel="$t('general.label.permissions')"
            class="ml-1 btn-lg"
          />
        </div>
        <div class="flex-grow-1 mt-1">
          <b-input-group>
            <b-form-input
              v-model.trim="query"
              class="float-right mw-100"
              type="search"
              :placeholder="$t('namespace.searchPlaceholder')" />
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

      <b-row
        v-if="namespacesFiltered && namespacesFiltered.length"
        align-v="stretch"
        class="pb-4"
      >
        <b-col
          v-for="n in namespacesFiltered"
          :key="n.namespaceID"
          cols="12"
          md="6"
          lg="4"
          xl="3"
          class="my-2"
        >
          <namespace-item :namespace="n" />
        </b-col>
      </b-row>
      <b-row
        v-else
        class="py-4"
      >
        <b-col>
          <h3 class="text-left">
            {{ $t('namespace.noResults') }}
          </h3>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import NamespaceItem from 'corteza-webapp-compose/src/components/Namespaces/NamespaceItem'

export default {
  components: {
    NamespaceItem,
  },

  data () {
    return {
      query: '',

      loaded: false,
      canCreateNamespace: false,
      canGrant: false,
    }
  },

  computed: {
    ...mapGetters({
      namespaces: 'namespace/set',
    }),

    namespacesFiltered () {
      return this.namespaces.filter(ns => ns.slug.indexOf(this.query) > -1 || ns.name.indexOf(this.query) > -1)
    },
  },

  created () {
    this.loaded = false

    this.$ComposeAPI.permissionsEffective().then((p) => {
      this.canCreateNamespace = p.filter(per => per.operation === 'namespace.create')[0].allow
      this.canGrant = p.filter(per => per.operation === 'grant')[0].allow
      this.loaded = true
    }).catch(this.toastErrorHandler(this.$t('notification.general.composeAccessNotAllowed')))
  },
}
</script>
