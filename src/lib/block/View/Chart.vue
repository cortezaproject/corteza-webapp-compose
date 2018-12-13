<template>
  <div class="small">
    <canvas ref="blockChart" width="200" height="200"></canvas>
  </div>
</template>
<script>
import base from './base'
import Chart from 'chart.js'

export default {
  extends: base,

  mounted () {
    const ctx = this.$refs.blockChart.getContext('2d')

    const opt = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: '@todo',
          data: [],
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    }

    let c = new Chart(ctx, opt)
    c.update()

    // const req = {
    //   moduleID: '62513226545365001',
    //   metrics: 'count:email;',
    //   dimensions: 'label:created_at|month',
    // }

    // this.$crm.moduleContentReport(req).then((rep) => {
    //   opt.data.labels = rep.map(i => i.label)
    //   opt.data.datasets[0].data = rep.map(i => i.count)
    //   c.update()
    // })
  },
}
</script>
