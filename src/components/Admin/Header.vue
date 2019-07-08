<template>
  <header>
    <b-navbar fixed type="light">
      <b-navbar-brand>
        <b><router-link :to="{name: 'pages'}" class="nav-link">{{ namespace.name }}</router-link></b>
      </b-navbar-brand>
      <b-navbar-nav class="mr-auto">
        <b-nav-item :to="{name: 'admin.modules'}" class="nav-link">{{ $t('navigation.module') }}</b-nav-item>
        <b-nav-item :to="{name: 'admin.pages'}" class="nav-link">{{ $t('navigation.page') }}</b-nav-item>
        <b-nav-item :to="{name: 'admin.charts'}" class="nav-link">{{ $t('navigation.chart') }}</b-nav-item>
        <b-nav-item :to="{name: 'admin.automation'}" class="nav-link">{{ $t('navigation.automation') }}</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="right">
        <b-nav-item :to="{name: 'pages'}" class="nav-link">{{ $t('navigation.publicPages') }}</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </header>
</template>

<script>
import Namespace from 'corteza-webapp-compose/src/lib/namespace'

export default {
  props: {
    pageID: {
      type: String,
      required: false,
      default: '',
    },

    namespace: {
      type: Namespace,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>

.navbar {
  background: $white;
  margin-bottom: 0;
  z-index: 1;
  box-shadow: 0 0.1rem 0.2rem 0 rgba(30, 34, 36, 0.1);
  border-bottom: 1px solid $light;

  .nav-link {
    .router-link-active {
      color: $primary;
    }
  }
}
</style>
