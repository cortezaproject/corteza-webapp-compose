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
      <div
        class="d-flex align-items-center justify-content-between mb-4"
      >
        <div
          v-if="canCreateNamespace"
          class="flex-grow-1"
        >
          <b-btn
            :to="{ name: 'namespace.create' }"
            variant="primary"
            size="lg"
          >
              {{ $t('create') }}
          </b-btn>
          <c-permissions-button
            v-if="canGrant"
            resource="corteza::compose:namespace/*"
            buttonVariant="light"
            :buttonLabel="$t('label.permissions')"
            class="ml-1 btn-lg"
          />
        </div>
        <div class="flex-grow-1 mt-1">
          <b-input-group>
            <b-form-input
              v-model.trim="query"
              class="float-right mw-100"
              type="search"
              :placeholder="$t('searchPlaceholder')" />
            <b-input-group-append>
              <b-input-group-text class="text-primary bg-white">
                <font-awesome-icon
                  :icon="['fas', 'search']"
                />
              </b-input-group-text>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>

      <transition-group
        v-if="namespacesFiltered && namespacesFiltered.length"
        name="namespace-list"
        tag="div"
        class="card-columns my-2"
      >
        <namespace-item
          v-for="n in namespacesFiltered"
          :key="n.namespaceID"
          :namespace="n"
          class="namespace-item"
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
    </b-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import NamespaceItem from 'corteza-webapp-compose/src/components/Namespaces/NamespaceItem'

export default {
  i18nOptions: {
    namespaces: 'namespace',
  },

  components: {
    NamespaceItem,
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

    namespacesFiltered () {
      return this.namespaces.filter(ns => {
        const query = this.query.toLowerCase()
        return (ns.slug).toLowerCase().indexOf(query) > -1 || (ns.name).toLowerCase().indexOf(query) > -1
      })
    },
  },
}
</script>
<style lang="scss" scoped>
  .namespace-col, .namespace-item {
    transition: all 0.2s ease;
  }

  .namespace-item {
    top: 0;

    &:hover {
      transition: all 0.2s ease;
      top: -1px;
    }
  }

  .namespace-list-leave-active {
    position: absolute;
    transition: opacity 0 0s ease;
  }

  .namespace-list-enter, .namespace-list-leave-to {
    opacity: 0;
  }
</style>
