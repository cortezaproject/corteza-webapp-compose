<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well table-responsive">
          <h2>List of charts</h2>
          <table class="table">
            <tbody>
            <tr v-for="(m, index) in charts" :key="index">
              <td>
                {{ m.name }}
              </td>
              <td><time :datetime="m.updatedAt" v-if="m.updatedAt">{{ prettyDate(m.updatedAt || m.createdAt) }}</time></td>
              <td class="actions text-right">
                <router-link :to="{name: 'admin.charts.edit', params: { chartID: m.chartID }}" class="action">
                  <i class="action icon-edit"></i>
                </router-link>
              </td>
            </tr>
            </tbody>
          </table>
          <form @submit.prevent="create">
            <b-form-group label="Create a new chart:">
              <b-input-group>
                <input required type="text" v-model="addChartFormData.name" class="form-control" id="name" placeholder="Chart name" />
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

import Field from '@/lib/field'

export default {
  name: 'ChartList',
  data () {
    return {
      charts: [],
      addChartFormData: {
        name: '',
        fields: [],
        config: {},
      },
    }
  },

  created () {
    this.$crm.chartList({}).then(cc => {
      this.charts = cc
    }).catch(this.defaultErrorHandler('Could not load chart list'))
  },

  methods: {
    create () {
      this.addChartFormData.fields = [
        new Field({ name: 'sample', kind: 'text' }),
      ]

      this.$crm.chartCreate(this.addChartFormData).then((chart) => {
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

table {
  td {
    min-width: 100px;
  }
}
</style>
