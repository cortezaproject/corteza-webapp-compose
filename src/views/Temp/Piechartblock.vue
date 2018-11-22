<template>
  <div class="vue-grid-item cssTransforms" style="transform: translate3d(10px, 10px, 0); width: 1000px; height: 430px; position: absolute;">
    <div>
      <!-- start CRM page block -->
      <div class="gridblock_contents">
        <div class="blockname">Blockname</div>
        <div class="block_header">Block header text</div>
        <div class="form_row" :ref="'chart_'+_uid"/>
      </div>
      <!-- start CRM page block -->
    </div>
  </div>
</template>

<script>
import c3 from 'c3'
import 'c3/c3.css'

export default {
  name: 'PieChart', // Can this be named like anything?
  components: {
    c3,
  },
  data () {
    return {
      data: null,
      config: {},
    }
  },
  async mounted () {
    try {
      this.data = await this.$crm.moduleChart({
        moduleID: 0,
        kind: 'pie',
      })
      this.config = {
        bindto: this.$refs['chart_' + this._uid], // This need to be an element
        data: {
          type: 'pie',
          columns: this.data.data,
        },
      }
      c3.generate(this.config)
    } catch (e) {
      console.log(e)
    }
  },
}
</script>
