<template>
  <div
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
            resource="corteza::compose:namespace/*"
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
        class="pb-4 mt-3"
      >
        <transition-group
          name="namespace-list"
          tag="div"
          class="d-flex flex-wrap flex-row h-100 w-100"
        >
          <b-col
            v-for="n in namespacesFiltered"
            :key="n.namespaceID"
            cols="12"
            md="6"
            lg="4"
            xl="3"
            class="namespace-col my-2 w-100"
          >
            <namespace-item
              :namespace="n"
              class="namespace-item"
            />
          </b-col>
        </transition-group>
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
      return this.namespaces.filter(ns => ns.slug.indexOf(this.query) > -1 || ns.name.indexOf(this.query) > -1)
    },
  },
}
</script>
<style lang="scss" scoped>
  .namespace-col, .namespace-item {
    transition: all 0.2s ease;
  }

  .namespace-item {
    box-shadow: 0;
    top: 0;

    &:hover {
      box-shadow: 0 4px 8px rgba(38, 38, 38, 0.2);
      transition: all 0.2s ease;
      top: -1px;
    }
  }

  .namespace-list-leave-active {
    position: absolute;
    transition: opacity 0.25 ease;
  }

  .namespace-list-enter, .namespace-list-leave-to {
    opacity: 0;
  }
</style>
