<template>
  <div class="scrollable">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well table-responsive">
            <div class="title-bar">
              <h2>{{ $t('chart.title')}}</h2>
              <div class="title-actions actions">
                <permissions-button v-if="namespace.canGrant" resource="compose:chart:*" link />
              </div>
            </div>
            <table class="table table-striped">
              <thead>
                <tr>
                  <table-sortable-column
                    :label="$t('general.label.name')"
                    name="name"
                    :ascending="sortedByName"
                    @sort="handleSort"/>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="(chart) in sortedCharts" :key="chart.chartID">
                <td>
                  {{ chart.name }}
                </td>
                <td>
                  <time :datetime="chart.updatedAt" v-if="chart.updatedAt">{{ prettyDate(chart.updatedAt || chart.createdAt) }}</time>
                </td>
                <td class="actions text-right">
                  <span v-if="chart.canUpdateChart || chart.canDeleteChart">
                    <router-link :to="{name: 'admin.charts.edit', params: { chartID: chart.chartID }}" class="action">
                      <i class="action icon-edit"></i>
                    </router-link>
                  </span>
                  <permissions-button v-if="chart.canGrant" class="action" :resource="'compose:chart:'+chart.chartID" link />
                </td>
              </tr>
              </tbody>
            </table>
            <form v-if="namespace.canCreateChart" @submit.prevent="create">
              <b-form-group :label="$t('chart.newLabel')">
                <b-input-group>
                  <input required type="text" v-model="newChart.name" class="form-control" id="name" :placeholder="$t('chart.newPlaceholder')" />
                  <b-input-group-append>
                    <button type="submit" class="btn btn-dark">{{ $t('general.label.create') }}</button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Chart from '@/lib/chart'
import TableSortableColumn from '@/components/Admin/TableSortableColumn'
import tableSort from '@/mixins/table_sort'

export default {
  name: 'ChartList',

  components: {
    TableSortableColumn,
  },

  mixins: [
    tableSort,
  ],

  props: {
    namespace: {
      type: Object,
      required: false,
    },
  },

  data () {
    const { namespaceID } = this.namespace
    return {
      newChart: new Chart({ namespaceID }),
    }
  },

  computed: {
    ...mapGetters({
      charts: 'chart/set',
    }),

    sortedByName () {
      return this.isSortedBy('name', true)
    },

    sortedCharts () {
      return this.sortedItems([...this.charts])
    },
  },

  methods: {
    ...mapActions({
      createChart: 'chart/create',
    }),

    create () {
      this.createChart(this.newChart).then((chart) => {
        this.$router.push({ name: 'admin.charts.edit', params: { chartID: chart.chartID } })
      }).catch(this.defaultErrorHandler(this.$t('notification.chart.createFailed')))
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

.btn {
  border-radius: 0;
}

.title-actions {
  padding-bottom: 10px;
  padding-right: 10px;
  margin-bottom: 0.5rem;
  line-height: 1;
  text-align: right;
  float: right;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 5px;
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
