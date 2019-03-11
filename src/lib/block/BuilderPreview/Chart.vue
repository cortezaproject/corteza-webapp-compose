<template>
  <div>
    <i18next path="block.chart.preview.chartId" tag="label">
      <code>{{ options.chartID }}</code>
    </i18next>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
