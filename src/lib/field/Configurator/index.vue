<template>
  <b-tabs active-nav-item-class="bg-grey"
          nav-wrapper-class="bg-white"
          active-tab-class="tab-content"
          card>

    <b-tab active :title="$t('general.label.general')">
      <basic :field="field" />
    </b-tab>
    <b-tab v-if="fieldComponent" :title="field.kind">
      <component :is="fieldComponent" :field="field" />
    </b-tab>
    <b-tab :title="$t('general.label.multi')">
      <multi :field="field" />
    </b-tab>
  </b-tabs>
</template>
<script>
import base from './base'
import * as Configurators from './loader'
import multi from './multi'
import basic from './basic'

export default {
  components: {
    ...Configurators,
    multi,
    basic,
  },

  extends: base,

  computed: {
    fieldComponent () {
      // If field doesn't have a configurator, we show no field tab
      return Configurators[this.field.kind]
    },
  },
}
</script>

<style lang="scss" scoped>
.tab-content {
  height: auto;
  max-height: 70vh;
  overflow-y: auto;
}
</style>
