<template>
  <div>
    <div>
      <label class="d-block">Value when marked as true</label>
      <b-form-input v-model="f.options.trueLabel" placeholder="True value"></b-form-input>
    </div>
    <div>
      <label class="d-block">Value when marked as false</label>
      <b-form-input v-model="f.options.falseLabel" placeholder="False value"></b-form-input>
    </div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
