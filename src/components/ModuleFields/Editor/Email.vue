<template>
  <b-form-group
    label-class="text-primary"
    :state="state"
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
        type="email"
        class="mr-2"
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
