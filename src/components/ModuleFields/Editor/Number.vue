<template>
  <b-form-group
    :label="label"
    label-class="text-primary"
    :class="formGroupStyleClasses"
  >
    <multi v-if="field.isMulti" :value.sync="value" v-slot="ctx">
      <b-input-group :prepend="field.options.prefix" :append="field.options.suffix">
        <b-form-input autocomplete="off" type="number" v-model="value[ctx.index]" class="mr-2"></b-form-input>
      </b-input-group>
      <errors :errors="errors" />
    </multi>
    <b-input-group v-else :prepend="field.options.prefix" :append="field.options.suffix">
      <b-form-input autocomplete="off" type="number" v-model="value"></b-form-input>
    </b-input-group>
    <errors :errors="errors" />
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
