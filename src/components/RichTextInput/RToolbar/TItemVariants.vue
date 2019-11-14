<template>
  <b-dropdown
    menu-class="text-center"
    variant="link">

    <template slot="button-content">
      <span class="text-dark font-weight-bold">
        <span :class="rootActiveClasses()">
          <font-awesome-icon
            v-if="format.icon"
            :icon="format.icon" />
          <span v-else>
            {{ format.label }}
          </span>
        </span>
      </span>
    </template>

    <b-dropdown-item
      v-for="v of format.variants"
      :key="v.variant"
      @click="onClick(format.type, v.attrs)">

      <b-button
        variant="link"
        class="text-dark font-weight-bold">

        <span :class="activeClasses(v.attrs)">
          <font-awesome-icon
            v-if="format.icon"
            :icon="v.icon" />
          <span v-else>
            {{ v.label }}
          </span>
        </span>
      </b-button>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import base from './base'

/**
 * Component is used to display complex formatter options - with extra attribute options
 * such as alignment
 */
export default {
  name: 'h-item-variants',
  extends: base,

  methods: {
    /**
     * Helper method to determine if the root formater should be shown as active
     * @returns {Array|undefined}
     */
    rootActiveClasses () {
      if (this.format.variants.find(({ type, attrs }) => this.activeClasses(attrs))) {
        return ['text-success']
      }
    },
  },
}
</script>
