<template>
  <div class="scrollable">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well table-responsive">
            <permissions-button v-if="namespace.canGrant"
                                resource="compose:chart:*"
                                class="float-right ml-2 mt-1 mr-3"
                                link />
            <export :list="sortedCharts" type="chart" class="float-right" />
            <h2>{{ $t('chart.title')}}</h2>
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
                  <permissions-button v-if="chart.canGrant" :title="chart.name" :resource="'compose:chart:'+chart.chartID" link />
                </td>
              </tr>
              </tbody>
            </table>
            <form v-if="namespace.canCreateChart" @submit.prevent="create" class="mt-4">
              <b-form-group :label="$t('chart.newLabel')">
                <b-input-group>
                  <input required type="text" v-model="newChart.name" class="form-control" id="name" :placeholder="$t('chart.newPlaceholder')" />
                  <b-input-group-append>
                    <b-button type="submit" variant="dark">{{ $t('general.label.create') }}</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </form>
            <import v-if="namespace.canCreateChart"
                    :namespace="namespace" type="chart" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Chart from 'corteza-webapp-compose/src/lib/chart'
import TableSortableColumn from 'corteza-webapp-compose/src/components/Admin/TableSortableColumn'
import tableSort from 'corteza-webapp-compose/src/mixins/table_sort'
import Import from 'corteza-webapp-compose/src/components/Admin/Import'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'

export default {
  name: 'ChartList',

  components: {
    TableSortableColumn,
    Import,
    Export,
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
