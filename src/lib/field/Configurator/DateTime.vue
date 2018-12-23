<template>
  <div>
    <div><b-form-checkbox plain v-model="f.options.onlyDate" :disabled="f.options.onlyTime">Date Only</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.onlyTime" :disabled="f.options.onlyDate">Time Only</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.onlyPastValues" :disabled="f.options.onlyFutureValues">Past Values Only</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.onlyFutureValues" :disabled="f.options.onlyPastValues">Future Value Only</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.outputRelative">Output Relative value (eg: 3 days ago)</b-form-checkbox></div>
    <div>Output format: <b-form-input plain v-model="f.options.format" placeholder="YYYY-MM-DD HH:ii"></b-form-input></div>
    See <a href="https://momentjs.com/docs/#/displaying/format/" target="_blank">Moment.js documentation</a> for formatting options
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
