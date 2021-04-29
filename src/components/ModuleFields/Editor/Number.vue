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
