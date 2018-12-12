<template>
  <div>
    <div><b-form-checkbox plain v-model="f.options.trimFragment">Trim '#' from the Url</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.trimQuery">Trim '?' from the Url</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.trimPath">Trim Url down to domain only</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.onlySecure">Only allow SSL (https) Url</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.outputPlain">Don't turn Url into a link</b-form-checkbox></div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
