<template>
  <div>
    <div><b-form-input v-model="f.options.format" placeholder="Format"></b-form-input></div>
    <div><b-form-input v-model="f.options.prefix" placeholder="Prefix"></b-form-input></div>
    <div><b-form-input v-model="f.options.suffix" placeholder="Suffix"></b-form-input></div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
