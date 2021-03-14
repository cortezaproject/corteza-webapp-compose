<template>
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
          <div
            class="float-right pt-2"
          >
            <c-permissions-button
              v-if="canGrant"
              resource="compose:namespace:*"
              link
            />
          </div>

          <b-col
            cols="12"
            lg="6"
            class="px-0"
          >
            <h1>
              {{ $t('namespace.title') }}
            </h1>
            <b-input
              v-model.trim="query"
              class="float-right mw-100"
              type="search"
              :placeholder="$t('namespace.searchPlaceholder')" />
          </b-col>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-if="canCreateNamespace"
               cols="6"
               class="mt-2"
        >
          <b-btn :to="{ name: 'namespace.create' }"
                 variant="primary"
                 size="lg"
          >
              {{ $t('namespace.create') }}
          </b-btn>
        </b-col>
      </b-row>

      <b-row align-v="stretch">
        <b-col cols="12" md="6" lg="4" class="mt-4" v-for="(n) in namespacesFiltered" :key="n.namespaceID">
          <namespace-item :namespace="n" />
        </b-col>
      </b-row>
    </b-container>
    <c-permissions-modal />
  </div>
</template>
<script>
import NamespaceItem from 'corteza-webapp-compose/src/components/Namespaces/NamespaceItem'
import { components } from '@cortezaproject/corteza-vue'
const { CPermissionsModal } = components

export default {
  components: {
    NamespaceItem,
    CPermissionsModal,
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
