<template>
  <div>
    <div><b-form-checkbox plain v-model="f.options.onlyDate" v-if="!f.options.onlyTime">Date Only</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.onlyTime" v-if="!f.options.onlyDate">Time Only</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.onlyPastValues" v-if="!f.options.onlyFutureValues">Past Values Only</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.onlyFutureValues" v-if="!f.options.onlyPastValues">Future Value Only</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.outputRelative">Make Output Relative</b-form-checkbox></div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
