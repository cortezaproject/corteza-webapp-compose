<template>
  <b-form-group
    :label="label"
    label-class="text-secondary"
    :class="formGroupStyleClasses"
    :state="state"
  >
    <multi v-if="field.isMulti" :value.sync="value" v-slot="ctx">
      <b-form-input
        type="email"
        v-model="value[ctx.index]"
      />
      <errors :errors="errors" />
    </multi>

    <template
      v-else
    >
      <b-form-input
        type="email"
        v-model="value"
        :state="state"
      />
      <errors :errors="errors" />
    </template>
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
