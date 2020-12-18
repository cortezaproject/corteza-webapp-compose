<template>
  <b-tab :title="$t('block.iframe.label')">
    <b-form-group
      v-if="enableFromRecordURL"
      class="form-group"
      :label="$t('block.iframe.srcFieldLabel')"
      :description="$t('block.iframe.srcFieldDesc')"
      :disabled="!fields.length"
    >
      <b-select
        v-model="options.srcField"
        type="url"
        class="form-control"
        :options="fieldOptions"
      />
    </b-form-group>
    <b-form-group
      class="form-group"
      :label="$t('block.iframe.srcLabel')"
      :description="enableFromRecordURL ? $t('block.iframe.srcDesc') : ''"
    >
      <b-form-input
        class="form-control"
        type="url"
        v-model="options.src"
      />
    </b-form-group>
  </b-tab>
</template>
<script>
import base from './base'

export default {
  name: 'IFrame',

  extends: base,

  computed: {
    fields () {
      if (!this.module) {
        return []
      }

      return this.module.fields
        .filter(({ kind }) => kind === 'Url')
        .map(({ name, label }) => ({ value: name, text: label }))
        .sort((a, b) => a.text.localeCompare(b.text))
    },

    fieldOptions () {
      return [
        { value: '', text: this.$t('block.iframe.pickURLField') },
        ...this.fields,
      ]
    },

    enableFromRecordURL () {
      return this.page.moduleID !== '0'
    },
  },
}
</script>
