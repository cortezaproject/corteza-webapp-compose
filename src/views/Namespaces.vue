<template>
<div>
  <div
    class="overflow-auto"
    v-if="loaded"
  >
    <small
      class="p-1 text-secondary position-absolute version"
    >
      {{ frontendVersion }}
    </small>
    <b-container class="pt-2 pb-5">
      <b-row no-gutters>
        <b-col>
          <h1 data-v-step="0">
            {{ $t('namespace.title') }}
          </h1>
        </b-col>
      </b-row>
      <b-row no-gutters
             class="align-items-center justify-content-between">
        <div v-if="canCreateNamespace"
             class="mt-2 flex-grow-1"
        >
          <b-btn :to="{ name: 'namespace.create' }"
                 variant="primary"
                 size="lg"
          >
              {{ $t('namespace.create') }}
          </b-btn>
          <c-permissions-button
            data-v-step="1"
            v-if="canGrant"
            resource="compose:namespace:*"
            buttonVariant="light"
            :buttonLabel="$t('general.label.permissions')"
            class="ml-1 btn-lg"
          />
        </div>
        <div class="flex-grow-1 mt-1" data-v-step="2">
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
      >
        <b-col cols="12" md="6" lg="4" class="mt-4" v-for="(n) in namespacesFiltered" :key="n.namespaceID">
          <namespace-item :namespace="n" />
        </b-col>
      </b-row>
      <b-row
        v-else
        class="mt-4"
      >
        <b-col>
          <h3 class="text-left">
            {{ $t('namespace.noResults') }}
          </h3>
        </b-col>
      </b-row>
    </b-container>
  </div>
  <v-tour v-if="tour !== null" :name="tour.name" :steps="tour.steps"></v-tour>
 </div>
</template>
<script>
import NamespaceItem from 'corteza-webapp-compose/src/components/Namespaces/NamespaceItem'
import Tour from 'corteza-webapp-compose/src/tour/Tour'

export default {
  components: {
    NamespaceItem,
  },

  data () {
    return {
      query: '',

      loaded: false,
      error: '',
      alerts: [], // { variant: 'info', message: 'foo' },
      namespaces: [],
      canCreateNamespace: false,
      canGrant: false,
      tour: Tour.namespacesTour,
    }
  },

  computed: {
    frontendVersion () {
      /* eslint-disable no-undef */
      return VERSION
    },

    namespacesFiltered () {
      return this.namespaces.filter(ns => ns.slug.indexOf(this.query) > -1 || ns.name.indexOf(this.query) > -1)
    },
  },
  watch: {
    loaded () {
      if (this.tour) {
        this.$tours[this.tour.name].start()
      }
    },
  },

  created () {
    this.error = ''

    const errHandler = (error) => {
      switch ((error.response || {}).status) {
        case 403:
          this.error = this.$t('notification.general.composeAccessNotAllowed')
      }

      return Promise.reject(error)
    }

    this.$ComposeAPI.namespaceList().then(({ set }) => {
      this.namespaces = set
      this.$ComposeAPI.permissionsEffective().then((p) => {
        this.canCreateNamespace = p.filter(per => per.operation === 'namespace.create')[0].allow
        this.canGrant = p.filter(per => per.operation === 'grant')[0].allow
        this.loaded = true
      })
    }).catch(errHandler)
  },
}
</script>
<style lang="scss" scoped>
.version {
  bottom: 0;
  right: 15px;
}
</style>
