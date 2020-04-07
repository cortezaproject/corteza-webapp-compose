<template>
  <div class="py-3">
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
                <export :list="charts" type="chart"/>
                <c-permissions-button v-if="namespace.canGrant"
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
            <b-table
              :fields="tableFields"
              :items="charts"
              striped
              borderless
              responsive
            >
              <template v-slot:cell(actions)="{ item: c }">
                <span v-if="c.canUpdateChart || c.canDeleteChart">
                  <router-link :to="{name: 'admin.charts.edit', params: { chartID: c.chartID }}" class="text-dark pr-2">
                    <font-awesome-icon :icon="['far', 'edit']"></font-awesome-icon>
                  </router-link>
                </span>
                  <c-permissions-button v-if="c.canGrant" :title="c.name" :resource="'compose:chart:'+c.chartID" link />
              </template>
            </b-table>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Chart from 'corteza-webapp-compose/src/lib/chart'
import Import from 'corteza-webapp-compose/src/components/Admin/Import'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'

export default {
  name: 'ChartList',

  components: {
    Import,
    Export,
  },

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

    tableFields () {
      return [
        {
          key: 'name',
          sortable: true,
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ]
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
