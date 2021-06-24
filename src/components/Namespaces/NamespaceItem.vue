<template>
  <b-card class="h-100 ns-item"
          footer-bg-variant="white"
          body-class="pb-0"
          footer-class="pb-3"
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
                :aria-label="$t('namespace.visit') + ' ' + namespace.name"
                variant="light"
                size="lg">
        {{ $t('namespace.visit') }}
      </b-button>
      <b-button v-if="namespace.canUpdateNamespace"
                :to="{ name: 'namespace.edit', params: { namespaceID: namespace.namespaceID } }"
                :aria-label="$t('namespace.edit') + ' ' + namespace.name"
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
$ns-min-height: 150px;

.ns-item {
  min-height: $ns-min-height;
}

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
