<template>
  <div class="d-flex flex-column w-100 vh-100" v-if="namespace.canManageNamespace">
    <router-view
      class="flex-grow-1 overflow-auto p-2"
      :namespace="namespace"
    />
    <portal-target
      name="admin-toolbar"
    />
    <portal to="topbar-title">
      {{ currentPageHandle }}
    </portal>

    <portal
      to="sidebar-body-expanded"
    >
      <b-button
        variant="light"
        class="w-100"
        :to="{ name: 'pages' }"
      >
        {{ $t('navigation.publicPages') }}
      </b-button>

      <b-button
        v-for="route of adminRoutes"
        :key="route.name"
        variant="link"
        class="w-100 text-left text-dark text-decoration-none pt-2 pb-0 nav-item"
        exact-active-class="nav-active"
        :to="{ name: route.name }"
      >
        <span class="d-inline-block w-75 text-nowrap text-truncate">
          {{ route.title }}
        </span>
      </b-button>
    </portal>

    <portal
      to="sidebar-footer-collapsed"
      class="d-flex"
    >
    </portal>
  </div>
</template>

<script>
export default {
  name: 'admin-root',

  props: {
    namespace: {
      type: Object,
      required: false,
    },
  },

  computed: {
    sidebarExpanded () {
      return !!this.$root.sidebarExpanded
    },

    currentPageHandle () {
      const nameToHandle = {
        'admin.modules': this.$t('module.title'),
        'admin.pages': this.$t('page.title'),
        'admin.charts': this.$t('chart.title'),
      }

      return nameToHandle[this.$route.name] || 'Admin'
    },

    adminRoutes () {
      return [
        { name: 'admin.modules', title: this.$t('navigation.module') },
        { name: 'admin.pages', title: this.$t('navigation.page') },
        { name: 'admin.charts', title: this.$t('navigation.chart') },
      ]
    },
  },

  mounted () {
    if (!this.namespace.canManageNamespace) {
      this.$router.push({ name: 'pages' })
    }
  },
}
</script>

<style scoped lang="scss">
// This has to be there, so chevrons are clickable inside the button
.pointer-none {
  pointer-events: none;
}

// Using font-weight-bold moves the sidebar nav content; text-stroke keeps in nicely in place
.nav-active > span {
  -webkit-text-stroke: 1px black;
}
</style>
