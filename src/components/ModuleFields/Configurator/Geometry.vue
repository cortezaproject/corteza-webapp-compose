<template>
  <div>
    <b-form-group
      :label="$t('kind.geometry.zoomLevel.label')"
    >
      <b-form-input
        v-model="f.options.zoomLevel"
        number
        type="range"
        min="0"
        max="18"
      />
      {{ f.options.zoomLevel }}
    </b-form-group>
  </div>
</template>

<script>
import base from './base'

export default {
  i18nOptions: {
    namespaces: 'field',
  },

  extends: base,
}
</script>
