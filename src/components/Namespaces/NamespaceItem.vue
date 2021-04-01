<template class="h-100">
  <b-card class="h-100 shadow-sm"
          footer-bg-variant="white"
          body-class="pb-0"
  >
    <h2 class="h5 overflow-hidden ns-title">{{ namespace.name }}</h2>
    <p v-if="namespace.meta.subtitle"
       class="font-weight-bold overflow-hidden ns-subtitle"
    >
          {{ namespace.meta.subtitle }}
    </p>
    <p v-if="namespace.meta.description"
       class="m-0 overflow-hidden ns-description"
    >
      {{ namespace.meta.description }}
    </p>
    <span slot="footer">
      <b-button v-if="namespace.enabled"
                :to="{ name: 'pages', params: { slug: (namespace.slug || namespace.namespaceID) } }"
                variant="light"
                size="lg">
        {{ $t('namespace.visit') }}
      </b-button>
      <b-button v-if="namespace.canUpdateNamespace"
                :to="{ name: 'namespace.edit', params: { namespaceID: namespace.namespaceID } }"
                variant="light"
                class="float-right"
                size="lg">
        <font-awesome-icon :icon="['far', 'edit']"/>
      </b-button>
      <slot />
    </span>
  </b-card>
</template>
<script>
export default {
  props: {
    namespace: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isEnabled () {
      return !!this.namespace.enabled
    },
  },
}
</script>
<style lang="scss" scoped>
.ns-title,
.ns-subtitle,
.ns-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.ns-title,
.ns-subtitle {
  -webkit-line-clamp: 2;
}

.ns-description {
  -webkit-line-clamp: 4;
}
</style>
