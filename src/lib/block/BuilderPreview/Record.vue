<template>
  <div v-if="options">
    <p v-if="module">
      <i18next path="block.record.preview.fieldsFromModule" tag="label">
        <span>{{ selectedFields }}</span>
        <code>{{ module.name || $t('block.record.preview.untitled') }}</code>
      </i18next>
    </p>
  </div>
  <div v-else>{{ $t('block.record.preview.blockNoRecord') }}</div>
</template>
<script>
import base from './base'

export default {
  extends: base,

  props: {
    module: {
      type: Object,
      required: false,
    },
  },

  computed: {
    selectedFields () {
      return this.options.fields.filter(f => !!f).map(f => f.name).join(', ')
    },
  },
}
</script>
