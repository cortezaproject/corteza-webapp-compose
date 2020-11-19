<template>
  <b-tab :title="$t('block.iframe.label')">
    <b-form-group
      class="form-group"
      :label="$t('block.iframe.srcFieldLabel')"
      :description="$t('block.iframe.srcFieldDesc')"
      :disabled="fields.length > 0"
    >
      <b-select
        class="form-control"
        type="url"
        v-model="options.srcField"
      >
        <option
          v-for="({ name, label, kind }) in fields"
          :key="name"
          :value="name">
          {{ label || name }} {{ kind }}
        </option>
      </b-select>
    </b-form-group>
    <b-form-group
      class="form-group"
      :label="$t('block.iframe.srcLabel')"
      :description="$t('block.iframe.srcDesc')"
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
        .sort((a, b) => a.label.localeCompare(b.label))
    },
  },
}
</script>
