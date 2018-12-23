<template>
  <div>
    <div><b-form-input v-model="f.options.prefix" placeholder="Prefix"></b-form-input></div>
    <div><b-form-input v-model="f.options.suffix" placeholder="Suffix"></b-form-input></div>
    <div><b-form-input v-model="f.options.precision" placeholder="Precision" type="number" min="0" max="6"></b-form-input></div>
    <div><b-form-input v-model="f.options.format" placeholder="Format"></b-form-input></div>
    <div>
      <p>Format Examples:</p>
      <table style="width:100%;">
        <tr>
          <th>Input</th>
          <th>Format</th>
          <th>Result</th>
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
