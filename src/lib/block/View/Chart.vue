<template>
  <div class="small">
    <canvas ref="blockChart" width="200" height="150"></canvas>
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
      type: 'polarArea',
      data: {
        labels: [
          'A',
          'B',
          'C',
          'D',
          'E',
        ],
        datasets: [{
          label: 'Important facts',
          data: [
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 1000),
          ],
          backgroundColor: [
            '#FFCC32',
            '#E85568',
            '#2FBC95',
            '#1397CB',
            '#00D53E',
            '#F3F3F5',
          ],
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
