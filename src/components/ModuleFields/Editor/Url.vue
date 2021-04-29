<template>
  <b-form-group
    label-class="text-primary"
    :class="formGroupStyleClasses"
  >
    <template #label>
      <div
        v-if="!valueOnly"
        class="d-flex align-items-top"
      >
        <label
          class="mb-0"
        >
          {{ label }}
        </label>

        <hint
          :text="hint"
          :id="field.fieldID"
        />
      </div>
      <small
        class="form-text font-weight-light text-muted"
      >
        {{ description }}
      </small>
    </template>

    <multi v-if="field.isMulti" :value.sync="value" v-slot="ctx">
      <b-form-input
        type="url"
        class="mr-2"
        placeholder="Example URL: https://example.com"
        :formatter="fixUrl"
        lazy-formatter
        v-model="value[ctx.index]"
      />
    </multi>
    <template
      v-else
    >
      <b-form-input
        type="url"
        placeholder="Example URL: https://example.com"
        :formatter="fixUrl"
        lazy-formatter
        v-model="value"
      />
      <errors :errors="errors" />
    </template>
  </b-form-group>
</template>
<script>
import base from './base'
import { trimUrlFragment, trimUrlQuery, trimUrlPath, onlySecureUrl } from '../url'

export default {
  extends: base,
  methods: {
    fixUrl (value) {
      // run through all the attributes
      if (this.field.options.trimFragment) {
        value = trimUrlFragment(value)
      }
      if (this.field.options.trimQuery) {
        value = trimUrlQuery(value)
      }
      if (this.field.options.trimPath) {
        value = trimUrlPath(value)
      }
      if (this.field.options.onlySecure) {
        value = onlySecureUrl(value)
      }

      return value
    },
  },
}
</script>
