<template>
  <aside>
    <b-list-group class="vh-100 bg-white overflow-auto">
      <b-list-group-item class="p-2 sticky-top">
        <b-form-input placeholder="Search"
                      v-model="filter" />

      </b-list-group-item>

      <div v-if="filteredNamespaces.pinned.length"
           class="border-bottom">
        <b-list-group-item v-for="ns in filteredNamespaces.pinned"
                          :key="ns.namespaceID"
                          :to="{ name: 'namespace', params: ns }"
                          class="p-2"
                          active-class="bg-white text-primary border-transparent">

          <span class="text-truncate d-block">
                {{ ns.name }}
          </span>
        </b-list-group-item>
      </div>

      <b-list-group-item v-for="ns in filteredNamespaces.regular"
                         :key="ns.namespaceID"
                         :to="{ name: 'namespace', params: ns }"
                         class="p-2"
                         active-class="bg-white text-primary border-transparent">

        <span class="text-truncate d-block">
              {{ ns.name }}
        </span>
      </b-list-group-item>
    </b-list-group>
  </aside>
</template>

<script>
import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'

export default {
  props: {
    namespaces: {
      type: Array,
      required: true,
    },

    namespace: {
      type: Namespace,
      required: false,
    },
  },

  data () {
    return {
      filter: null,
      pinned: new Set(),
    }
  },

  computed: {
    filteredNamespaces () {
      const rtr = {
        pinned: [],
        regular: [],
      }
      this.namespaces.forEach(ns => {
        if (this.pinned.has(ns.namespaceID)) {
          rtr.pinned.push(ns)
        } else if (!this.filter || `${ns.name}${ns.slug}${ns.namespaceID}`.indexOf(this.filter) > -1) {
          rtr.regular.push(ns)
        }
      })
      return rtr
    },
  },

  created () {
    this.$root.$on('namespaces.pin', this.pinNamespace)
  },
  beforeDestroy () {
    this.$root.$off('namespaces.pin', this.pinNamespace)
  },

  methods: {
    pinNamespace (namespaceID) {
      console.log({ namespaceID })
      this.pinned.add(namespaceID)
    },
  },
}
</script>

<style scoped lang="scss">
  aside {
    width: 200px;

    .list-group-item {
      &.active {
        border-right: 3px solid $primary;
        background-color: rgba($primary, 0.15);
      }
    }
  }
</style>
