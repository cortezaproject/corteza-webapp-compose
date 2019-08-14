<template>
  <div>
    <b-form-group>
      <label class="d-block">{{ $t('field.kind.number.prefixLabel') }}</label>
      <b-form-input v-model="f.options.prefix" :placeholder="$t('field.kind.number.prefixPlaceholder')"></b-form-input>
    </b-form-group>
    <b-form-group>
      <label class="d-block">{{ $t('field.kind.number.suffixLabel') }}</label>
      <b-form-input v-model="f.options.suffix" :placeholder="$t('field.kind.number.suffixPlaceholder')"></b-form-input>
    </b-form-group>
    <b-form-group>
      <label class="d-block">{{ $t('field.kind.number.precisionLabel') }}</label>
      <b-form-input v-model="f.options.precision" :placeholder="$t('field.kind.number.precisionPlaceholder')" type="number" min="0" max="6"></b-form-input>
    </b-form-group>
    <b-form-group>
      <label class="d-block">{{ $t('field.kind.number.formatLabel') }}</label>
      <b-form-input v-model="f.options.format" :placeholder="$t('field.kind.number.formatPlaceholder')"></b-form-input>
    </b-form-group>
    <div>
      <p>{{ $t('field.kind.number.examplesLabel') }}</p>
      <table style="width: 100%;">
        <tr>
          <th>{{ $t('field.kind.number.exampleInput') }}</th>
          <th>{{ $t('field.kind.number.exampleFormat') }}</th>
          <th>{{ $t('field.kind.number.exampleResult') }}</th>
        </tr>
        <tr>
          <td>10000.234</td>
          <td>$0.00</td>
          <td>$10000.23</td>
        </tr>
        <tr>
          <td>0.974878234</td>
          <td>0.000%</td>
          <td>97.488%</td>
        </tr>
        <tr>
          <td>1</td>
          <td>0%</td>
          <td>100%</td>
        </tr>
        <tr>
          <td>238</td>
          <td>00:00:00</td>
          <td>0:03:58</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
