<template>
  <b-navbar class="bg-white border-bottom border-light shadow-sm" toggleable="md">
    <b-navbar-brand>
      <b><router-link :to="{name: 'pages'}" class="nav-link">{{ namespace.name }}</router-link></b>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse" class="border-0"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="mr-auto pl-2">
        <b-nav-item :to="{name: 'admin.modules'}" class="nav-link">{{ $t('navigation.module') }}</b-nav-item>
        <b-nav-item :to="{name: 'admin.pages'}" class="nav-link">{{ $t('navigation.page') }}</b-nav-item>
        <b-nav-item :to="{name: 'admin.charts'}" class="nav-link">{{ $t('navigation.chart') }}</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="right pl-2">
        <b-nav-item :to="{name: 'pages'}" class="nav-link">{{ $t('navigation.publicPages') }}</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
  props: {
    pageID: {
      type: String,
      required: false,
      default: '',
    },

    namespace: {
      type: compose.Namespace,
      required: true,
    },
  },
}
</script>
