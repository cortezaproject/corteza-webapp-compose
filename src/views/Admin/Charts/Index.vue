<template>
  <div class="py-3">
    <b-container fluid>
      <b-row no-gutters>
        <b-col xl="8" offset-xl="2">
        <h1 class="mb-4">
          {{ $t('chart.title') }}

          <c-permissions-button
            v-if="namespace.canGrant"
            resource="compose:chart:*"
            class="btn mt-1 pr-0 float-right"
            link
          />
        </h1>
          <b-card no-body>
            <b-card-header header-bg-variant="white">
              <b-row
                no-gutters
              >
                <b-col
                  cols="6"
                >
                  <b-dropdown
                    v-if="namespace.canCreateChart"
                    variant="primary"
                    size="lg"
                    class="float-left"
                    :text="$t('block.chart.add')"
                    >
                      <b-dropdown-item-button
                        variant="dark"
                        @click="$router.push({ name: 'admin.charts.create', params: { category: 'generic' } })"
                      >
                        {{ $t('block.chart.addGeneric') }}
                      </b-dropdown-item-button>
                      <b-dropdown-item-button
                        variant="dark"
                        @click="$router.push({ name: 'admin.charts.create', params: { category: 'funnel' } })"
                      >
                        {{ $t('block.chart.addFunnel') }}
                      </b-dropdown-item-button>
                      <b-dropdown-item-button
                        variant="dark"
                        @click="$router.push({ name: 'admin.charts.create', params: { category: 'gauge' } })"
                      >
                        {{ $t('block.chart.addGauge') }}
                      </b-dropdown-item-button>
                    </b-dropdown>

                  <import
                    v-if="namespace.canCreateChart"
                    :namespace="namespace"
                    type="chart"
                    class="float-left ml-2"
                  />

                  <export
                    :list="charts"
                    type="chart"
                    class="float-left ml-2"
                  />
                </b-col>
                <b-col
                  cols="6"
                >
                  <b-input
                    v-model.trim="query"
                    class="float-right mw-100"
                    type="search"
                    :placeholder="$t('chart.searchPlaceholder')" />

                </b-col>
              </b-row>
            </b-card-header>

            <b-card-body class="p-0">
              <b-table
                :fields="tableFields"
                :items="charts"
                :filter="query"
                :filter-included-fields="['handle', 'name']"
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
                    class="btn px-2"
                  />
                </template>
              </b-table>
            </b-card-body>
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
      query: '',

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
          tdClass: 'align-middle pl-4',
          thClass: 'pl-4',
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
<style lang="scss" scoped>
$input-height: 42px;

.chart-name-input {
  height: $input-height;
}
</style>
