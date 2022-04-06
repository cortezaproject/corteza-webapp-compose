<template>
  <div>
    <b-form-group>
      <label class="d-block">Initial Zoom Level</label>
      <b-form-input
        v-model="f.options.zoomLevel"
        placeholder="Zoom Level"
        type="number"
        min="0"
        max="18"
      />
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
