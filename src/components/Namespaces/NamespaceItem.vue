<template class="h-100">
  <b-card class="h-100 shadow-sm"
          footer-bg-variant="white"
          body-class="pb-0"
  >
    <h2 class="h5">{{ namespace.name }}</h2>
    <p v-if="namespace.meta.subtitle"
       class="font-weight-bold"
    >
          {{ namespace.meta.subtitle }}
    </p>
    <p v-if="namespace.meta.description"
       class="m-0"
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
