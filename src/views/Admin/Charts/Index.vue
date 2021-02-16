<template>
  <div class="py-3">
    <b-container fluid>
      <b-row no-gutters>
        <b-col xl="8" offset-xl="2">
        <h1>{{ $t('chart.title') }}</h1>
          <b-card no-body>
            <b-card-header header-bg-variant="white">
            <b-button type="submit" variant="primary" size="lg">{{ $t('general.label.create') }}</b-button>
            <b-button type="submit" variant="light" size="lg" class="ml-1">Import</b-button>
            <export :list="charts" type="chart" class="ml-1"/>
            <c-permissions-button
              v-if="namespace.canGrant"
              resource="compose:module:*"
              class="float-right mt-1"
              link
            />
            </b-card-header>
            <b-card-body class="p-0">
              <b-table
                :fields="tableFields"
                :items="charts"
                @row-clicked="handleRowClicked"
                head-variant="light"
                tbody-tr-class="pointer"
                responsive
                hover
              >
                <template v-slot:cell(updatedAt)="{ item: c }">
                  {{ (c.updatedAt || c.createdAt) | locDateOnly }}
                </template>
                <template v-slot:cell(actions)="{ item: c }">
                  <c-permissions-button
                    v-if="c.canGrant"
                    :title="c.name"
                    :target="c.name"
                    :resource="'compose:chart:'+c.chartID"
                    link
                  />
                </template>
              </b-table>
            </b-card-body>
            <b-row align-v="center">
              <b-col md="5">
                <b-form v-if="namespace.canCreateChart" @submit.prevent="create">
                  <b-form-group :label="$t('chart.newLabel')">
                    <b-input-group>
                      <input required type="text" v-model="newChart.name" class="form-control" id="name" :placeholder="$t('chart.newPlaceholder')" />
                      <b-input-group-append>
                        <b-dropdown
                            :text="$t('block.chart.add')"
                          >
                            <b-dropdown-item-button
                              variant="primary"
                              @click="create('generic')"
                            >
                              {{ $t('block.chart.addGeneric') }}
                            </b-dropdown-item-button>
                            <b-dropdown-item-button
                              variant="primary"
                              @click="create('funnel')"
                            >
                              {{ $t('block.chart.addFunnel') }}
                            </b-dropdown-item-button>
                            <b-dropdown-item-button
                              variant="primary"
                              @click="create('gauge')"
                            >
                              {{ $t('block.chart.addGauge') }}
                            </b-dropdown-item-button>
                          </b-dropdown>

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

                <c-permissions-button
                  v-if="namespace.canGrant"
                  resource="compose:chart:*"
                  link
                />
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { compose } from '@cortezaproject/corteza-js'
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
    return {
      newChart: new compose.Chart({}),
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
          tdClass: 'align-middle',
        },
        {
          key: 'handle',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: 'updatedAt',
          sortable: true,
          tdClass: 'align-middle',
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

    create (subType) {
      let c = new compose.Chart({ ...this.newChart, namespaceID: this.namespace.namespaceID })
      switch (subType) {
        case 'gauge':
          c = new compose.GaugeChart(c)
          break

        case 'funnel':
          c = new compose.FunnelChart(c)
          break
      }

      this.createChart(c).then((chart) => {
        this.$router.push({ name: 'admin.charts.edit', params: { chartID: chart.chartID } })
      }).catch(this.defaultErrorHandler(this.$t('notification.chart.createFailed')))
    },
    handleRowClicked ({ chartID, canUpdateChart, canDeleteChart }) {
      if (!(canUpdateChart || canDeleteChart)) {
        return
      }
      this.$router.push({
        name: 'admin.charts.edit',
        params: { chartID },
        query: null,
      })
    },
  },
}
</script>
