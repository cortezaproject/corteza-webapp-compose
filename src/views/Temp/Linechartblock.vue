<template>
  <div class="vue-grid-item cssTransforms" style="transform: translate3d(10px, 10px, 0); width: 1000px; height: 430px; position: absolute;">
    <div>
      <!-- start CRM page block -->
      <div class="gridblock_contents">
        <div class="blockname">Blockname</div>
        <div class="block_header">Block header text</div>
        <div class="form_row" :ref="'chart_'+_uid"/>
      </div>
      <!-- end CRM page block -->
    </div>
  </div>
</template>

<script>
import { timeFormat } from 'd3-time-format'
import c3 from 'c3'
import 'c3/c3.css'

export default {
  name: 'LineChart', // Can this be named like anything?
  components: {
    c3,
  },
  data () {
    return {
      data: null,
      config: {},
      parseTime: timeFormat('%b %d, %Y'),
    }
  },
  async mounted () {
    try {
      this.data = await this.$crm.chartDataGet({
        moduleID: 0,
        kind: 'line',
      })
      this.config = {
        bindto: this.$refs['chart_' + this._uid], // This need to be an element
        data: {
          type: 'line',
          x: this.data.data[0][0],
          columns: this.data.data,
        },
        axis: {
          x: {
            type: this.data.fields[this.data.data[0][0]].kind === 'datetime' ? 'timeseries' : 'category',
            tick: {
              format: (x) =>
              {
                return this.parseTime(x)
              },
            },
          },
        },
      }
      c3.generate(this.config)
    } catch (e) {
      console.log(e)
    }
  },
}
</script>
