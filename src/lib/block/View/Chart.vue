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
          label: '# of Records',
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

    this.$crm.moduleList({}).then((mm) => {
      mm.forEach((m) => {
        this.$crm.moduleContentList({ moduleID: m.moduleID, perPage: 1 }).then(r => {
          if (r.meta.count) {
            opt.data.labels.push(m.name)
            opt.data.datasets[0].data[opt.data.labels.length - 1] = r.meta.count
            c.update()
          }
        })
      })
    })
  },
}
</script>
