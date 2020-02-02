<template>
  <div>
    <div><b-form-checkbox v-model="f.options.onlyDate" :disabled="f.options.onlyTime">{{ $t('field.kind.dateTime.dateOnly') }}</b-form-checkbox></div>
    <div><b-form-checkbox v-model="f.options.onlyTime" :disabled="f.options.onlyDate">{{ $t('field.kind.dateTime.timeOnly') }}</b-form-checkbox></div>
    <div><b-form-checkbox v-model="f.options.onlyPastValues" :disabled="f.options.onlyFutureValues">{{ $t('field.kind.dateTime.pastValuesOnly') }}</b-form-checkbox></div>
    <div><b-form-checkbox v-model="f.options.onlyFutureValues" :disabled="f.options.onlyPastValues">{{ $t('field.kind.dateTime.futureValuesOnly') }}</b-form-checkbox></div>
    <div><b-form-checkbox v-model="f.options.outputRelative">{{ $t('field.kind.dateTime.relativeOutput') }}</b-form-checkbox></div>
    <div>{{ $t('field.kind.dateTime.outputFormat') }}<b-form-input plain v-model="f.options.format" placeholder="YYYY-MM-DD HH:ii"></b-form-input></div>

    <i18next path="field.kind.dateTime.outputFormatFootnote" tag="label">
      <a href="https://momentjs.com/docs/#/displaying/format/" target="_blank">Moment.js</a>
    </i18next>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
