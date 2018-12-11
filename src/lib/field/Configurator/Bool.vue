<template>
  <div>
    <div>
      <label class="d-block">Value when checked</label>
      <b-form-input v-model="f.options.trueLabel" placeholder="Checked value"></b-form-input>
    </div>
    <div>
      <label class="d-block">Value when unchecked</label>
      <b-form-input v-model="f.options.falseLabel" placeholder="Unchecked value"></b-form-input>
    </div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
