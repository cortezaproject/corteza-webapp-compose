<template>
  <div class="vue-grid-item cssTransforms" style="transform: translate3d(10px, 10px, 0); width: 1000px; height: 430px; position: absolute;">
    <div>
      <!-- start CRM page block -->
      <div class="gridblock_contents">
        <div class="blockname">Blockname</div>
        <div class="block_header">Block header text</div>
        <div class="form_row">
          Here I want to show the chart...
        </div>
      </div>
      <!-- end CRM page block -->
    </div>
  </div>
</template>

<script>
import c3 from 'c3'

export default {
  name: 'Chart', // Can this be named like anything?
  components: {
    c3,
  },
  data () {
    return {
      chart: '', // I know this is a string, but I need this.chart in line 32 to be an element.
    }
  },
  mounted: function () {
    c3.generate({
      bindto: this.chart, // This need to be an element
      data: {
        type: 'area',
        x: 'x',
        xFormat: '%H:%M',
        columns: [
          [
            'x',
            '12:38',
            '12:38',
            '12:38',
            '12:38',
            '12:39',
            '12:39',
            '12:39',
            '12:39',
            '12:40',
            '12:40',
            '12:40',
            '12:41',
            '12:41',
            '12:41',
            '12:41',
            '12:42',
            '12:42',
            '12:42',
            '12:42',
            '12:43',
            '12:43',
            '12:43',
            '12:43',
            '12:44',
            '12:44',
          ],
          [
            'write',
            14709198848,
            14709313536,
            14709522432,
            14709633024,
            14710034432,
            14710157312,
            14710341632,
            14710583296,
            14710788096,
            14710931456,
            14711058432,
            14711291904,
            14711508992,
            14711668736,
            14711771136,
            14712008704,
            14712107008,
            14712381440,
            14712586240,
            14712795136,
            14712963072,
            14713077760,
            14713331712,
            14713565184,
            14713729024,
          ],
          [
            'read',
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
            3778094080,
          ],
        ],
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: function (x) {
              if (x.getDate() === 1) {
                return x.toLocaleDateString()
              }
            },
          },
        },
      },
    })
  },
}
</script>
