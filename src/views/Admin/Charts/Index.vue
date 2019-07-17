<template>
  <div class="mt-3">
    <b-container>
      <b-row>
        <b-col md="12">
          <b-card class="mb-2">
            <b-row align-v="center">
              <b-col md="5">
                <b-form v-if="namespace.canCreateChart" @submit.prevent="create">
                  <b-form-group :label="$t('chart.newLabel')">
                    <b-input-group>
                      <input required type="text" v-model="newChart.name" class="form-control" id="name" :placeholder="$t('chart.newPlaceholder')" />
                      <b-input-group-append>
                        <b-button type="submit" variant="dark">{{ $t('general.label.create') }}</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-form>
              </b-col>
              <b-col md="5">
                <import v-if="namespace.canCreateChart"
                        :namespace="namespace" type="chart" />
              </b-col>
              <b-col md="2" class="text-right">
                <export :list="sortedCharts" type="chart"/>
                <permissions-button v-if="namespace.canGrant"
                                    resource="compose:chart:*"
                                    link />
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <b-card :title="$t('chart.title')">
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
                <td class="text-right">
                  <span v-if="chart.canUpdateChart || chart.canDeleteChart">
                    <router-link :to="{name: 'admin.charts.edit', params: { chartID: chart.chartID }}" class="text-dark pr-2">
                      <font-awesome-icon :icon="['far', 'edit']"></font-awesome-icon>
                    </router-link>
                  </span>
                  <permissions-button v-if="chart.canGrant" :title="chart.name" :resource="'compose:chart:'+chart.chartID" link />
                </td>
              </tr>
              </tbody>
            </table>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
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
