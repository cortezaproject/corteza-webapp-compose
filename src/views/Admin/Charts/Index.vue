<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well table-responsive">
          <h2>List of charts</h2>
          <table class="table table-striped">
            <tbody>
            <tr v-for="(chart) in charts" :key="chart.chartID">
              <td>
                {{ chart.name }}
              </td>
              <td><time :datetime="chart.updatedAt" v-if="chart.updatedAt">{{ prettyDate(chart.updatedAt || chart.createdAt) }}</time></td>
              <td class="actions text-right">
                <router-link :to="{name: 'admin.charts.edit', params: { chartID: chart.chartID }}" class="action">
                  <i class="action icon-edit"></i>
                </router-link>
              </td>
            </tr>
            </tbody>
          </table>
          <form @submit.prevent="create">
            <b-form-group label="Create a new chart:">
              <b-input-group>
                <input required type="text" v-model="newChart.name" class="form-control" id="name" placeholder="Chart name" />
                <b-input-group-append>
                  <button type="submit" class="btn btn-dark">Create</button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Chart from '@/lib/chart'

export default {
  name: 'ChartList',
  data () {
    return {
      newChart: new Chart(),
    }
  },

  computed: {
    ...mapGetters({
      charts: 'chart/set',
    }),
  },

  methods: {
    ...mapActions({
      createChart: 'chart/create',
    }),

    create () {
      this.createChart(this.newChart).then((chart) => {
        this.$router.push({ name: 'admin.charts.edit', params: { chartID: chart.chartID } })
      }).catch(this.defaultErrorHandler('Could not create a chart'))
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

.btn {
  border-radius: 0;
}

.table {
  td {
    min-width: 100px;
    border-top: 0;
  }
}

form {
  margin-top: 50px;
}
</style>
