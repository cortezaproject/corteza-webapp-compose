<template>
  <b-tabs nav-wrapper-class="bg-white border-bottom"
          active-tab-class="tab-content h-auto overflow-auto"
          card>

    <b-tab active :title="$t('general.label.general')">
      <basic
        :namespace="namespace"
        :field="field"
      />
    </b-tab>
    <b-tab
      v-if="fieldComponent"
      :title="field.kind">
      <component
        :is="fieldComponent"
        :namespace="namespace"
        :module="module"
        :field="field"
      />
    </b-tab>
    <b-tab
      v-if="field.cap.multi"
      :disabled="!field.isMulti"
      :title="$t('general.label.multi')"
    >
      <multi
        :namespace="namespace"
        :field="field"
      />
    </b-tab>
    <b-tab
      :title="$t('general.label.validation')"
    >
      <validation
        :field="field"
      />
    </b-tab>
  </b-tabs>
</template>
<script>
import base from './base'
import * as Configurators from './loader'
import multi from './multi'
import basic from './basic'
import validation from './validation'

export default {
  components: {
    ...Configurators,
    multi,
    basic,
    validation,
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
  max-height: 70vh;
}
</style>
