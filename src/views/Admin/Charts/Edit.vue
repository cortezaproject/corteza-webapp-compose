<template>
  <div class="py-3">
    <portal to="topbar-title">
      {{ $t('chart.edit.title') }}
    </portal>

    <b-container
      @submit.prevent="handleSave"
      tag="form"
      fluid="xl"
    >
      <b-row no-gutters>
        <b-col v-if="chart">
          <b-card
            no-body
            class="shadow-sm"
          >
            <b-card-header
              header-bg-variant="white"
              class="d-flex py-3 align-items-center border-bottom"
            >
              <export :list="[chart]" type="chart" class="float-right" slot="header"/>
            </b-card-header>
            <b-container
              fluid
              class="px-4 py-3"
            >
              <b-row>
                <b-col xl="6" md="12">
                  <fieldset v-if="modules">
                    <b-form-input v-model="chart.name" :placeholder="$t('chart.newPlaceholder')" class="mb-1"></b-form-input>
                    <b-form-input v-model="chart.handle" :placeholder="$t('general.placeholder.handle')" :state="handleState" class="mb-1"></b-form-input>

                    <b-form-group>
                      <b-form-select
                        v-model="chart.config.colorScheme"
                        :options="colorSchemes"
                        class="mt-1"
                      >
                        <template slot="first">
                          <option
                            :value="undefined"
                            disabled
                          >
                            {{ $t('chart.colorScheme') }}
                          </option>
                        </template>
                      </b-form-select>
                    </b-form-group>
                  </fieldset>

                  <!-- Some charts support multiple reports -->
                  <fieldset
                    v-if="supportsMultipleReports"
                    class="form-group mt-2"
                  >
                    <b-form-group class="mb-2">
                      <h4 class="d-inline-block">
                        {{ $t('block.chart.configure.reportsLabel') }}
                      </h4>
                      <b-btn
                        v-if="reportsValid"
                        class="float-right p-0"
                        variant="link"
                        @click="onAddReport"
                      >
                        + {{ $t('general.label.add') }}
                      </b-btn>
                      <div class="ml-1">
                        <draggable
                          v-model="reports"
                          :options="{ handle:'.handle' }"
                          class="w-100 d-inline-block"
                          tag="tbody"
                        >

                          <report-item
                            v-for="(r, i) in reports"
                            :key="i"
                            :report="r"
                            :fixed="reports.length === 1"
                            @edit="onEditReport(i)"
                            @remove="onRemoveReport(i)"
                          >
                            <template #report-label>
                              <template v-if="r.moduleID">
                                {{ moduleName(r.moduleID) }}
                              </template>
                              <template v-else>
                                {{ $t('chart.edit.unconfiguredReport') }}
                              </template>
                            </template>
                          </report-item>
                        </draggable>
                      </div>
                    </b-form-group>

                  </fieldset>

                  <!-- Generic report editing component -->
                  <component
                    :is="reportEditor"
                    v-if="editReport"
                    :report.sync="editReport"
                    :modules="modules"
                    :dimension-field-kind="['Select']"
                    :supported-metrics="1"
                  />
                </b-col>

                <b-col xl="6" md="12">
                  <b-button
                    v-if="!error"
                    @click.prevent="update"
                    :disabled="processing"
                    class="float-right"
                    variant="outline-primary">{{ $t('chart.edit.loadData') }}
                  </b-button>
                  <b-alert
                    :show="error"
                    variant="warning"
                  >
                    {{ error }}
                  </b-alert>

                  <div class="chart-preview w-100 h-100">
                    <chart-component
                      v-if="chart"
                      :chart="chart"
                      :reporter="reporter"
                      ref="chart"
                      width="200"
                      height="200"
                      @error="error=$event"
                      @updated="onUpdated"
                    />
                  </div>
                  <!-- not supporting multiple reports for now
  <b-button @click.prevent="reports.push(defaultReport)"
          v-if="false"
          class="float-right">+ Add report</b-button>
  -->
                </b-col>
              </b-row>
            </b-container>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <portal to="admin-toolbar">
      <editor-toolbar
        v-if="chart"
        :back-link="{name: 'admin.charts'}"
        :hideDelete="hideDelete"
        :hideSave="hideSave"
        @delete="handleDelete"
        @save="handleSave()"
        @saveAndClose="handleSave({ closeOnSuccess: true })">
      </editor-toolbar>
    </portal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Report from 'corteza-webapp-compose/src/components/Admin/Chart/Editor/Report'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import { compose, NoID } from '@cortezaproject/corteza-js'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'
import ChartComponent from 'corteza-webapp-compose/src/components/Chart'
import { handleState } from 'corteza-webapp-compose/src/lib/handle'
import draggable from 'vuedraggable'
import ReportItem from 'corteza-webapp-compose/src/components/Chart/ReportItem'
import Reports from 'corteza-webapp-compose/src/components/Chart/Report'
import { chartConstructor } from 'corteza-webapp-compose/src/lib/charts'
import schemes from 'chartjs-plugin-colorschemes/src/colorschemes'

const defaultReport = {
  moduleID: undefined,
  metrics: [{ field: 'count' }],
  dimensions: [{ field: 'created_at', modifier: 'MONTH' }],
}

export default {
  components: {
    Report,
    EditorToolbar,
    Export,
    ChartComponent,
    draggable,
    ReportItem,
  },

  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    chartID: {
      type: String,
      required: false,
      default: NoID,
    },

    category: {
      type: String,
      required: false,
    },
  },

  data () {
    return {
      chart: new compose.Chart(),
      error: null,
      processing: false,

      editReportIndex: undefined,
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
      modByID: 'module/getByID',
    }),

    colorSchemes () {
      const splicer = sc => {
        const rr = (/(\D+)(\d+)$/gi).exec(sc)
        return {
          label: rr[1],
          count: rr[2],
        }
      }
      const capitalize = w => `${w[0].toUpperCase()}${w.slice(1)}`
      const rr = []
      for (const g in schemes) {
        for (const sc in schemes[g]) {
          const gn = splicer(sc)
          rr.push({
            text: `${capitalize(g)}: ${capitalize(gn.label)} (${this.$t('chart.colorLabel', gn)})`,
            value: `${g}.${sc}`,
            count: gn.count,
          })
        }
      }

      return rr
    },

    defaultReport () {
      return Object.assign({}, defaultReport)
    },

    handleState () {
      return handleState(this.chart.handle)
    },

    supportsMultipleReports () {
      if (!this.chart) {
        return false
      }

      if (this.chart instanceof compose.FunnelChart) {
        return true
      }
      return false
    },

    reportsValid () {
      if (!this.reports) {
        return false
      }

      return !this.reports.find(({ moduleID }) => !moduleID)
    },

    reportEditor () {
      if (!this.chart) {
        return undefined
      }

      if (this.chart instanceof compose.FunnelChart) {
        return Reports.FunnelChart
      }
      if (this.chart instanceof compose.GaugeChart) {
        return Reports.GagueChart
      }
      return Reports.GenericChart
    },

    reports: {
      get () {
        return this.chart.config.reports
      },
      set (r) {
        this.chart.config.reports = r
      },
    },

    editReport: {
      get () {
        if (this.editReportIndex !== undefined) {
          return this.reports[this.editReportIndex]
        }
        return undefined
      },
      set (v) {
        this.reports.splice(this.editReportIndex, 1, v)
      },
    },

    hideDelete () {
      return this.chart.chartID === NoID || !this.chart.canDeleteChart
    },

    hideSave () {
      return this.chart.chartID !== NoID && !this.chart.canUpdateChart
    },
  },

  watch: {
    chartID: {
      handler: function (chartID) {
        if (chartID === NoID) {
          let c = new compose.Chart({ namespaceID: this.namespace.namespaceID })
          switch (this.category) {
            case 'gauge':
              c = new compose.GaugeChart(c)
              break

            case 'funnel':
              c = new compose.FunnelChart(c)
              break
          }
          this.chart = c
          this.onEditReport(0)
        } else {
          this.findChartByID({ chartID: this.chartID }).then((chart) => {
            // Make a copy so that we do not change store item by ref
            this.chart = chartConstructor(chart)
            this.onEditReport(0)
          }).catch(this.toastErrorHandler(this.$t('notification.chart.loadFailed')))
        }
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions({
      findChartByID: 'chart/findByID',
      createChart: 'chart/create',
      updateChart: 'chart/update',
      deleteChart: 'chart/delete',
    }),

    moduleName (moduleID) {
      return this.modByID(moduleID).name
    },

    reporter (r) {
      return this.$ComposeAPI.recordReport({ namespaceID: this.namespace.namespaceID, ...r })
    },

    update () {
      this.processing = true
      this.$refs.chart.updateChart()
    },

    onUpdated () {
      this.processing = false
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      const c = Object.assign({}, this.chart)
      delete (c.config.renderer.data)

      if (this.chart.chartID === NoID) {
        this.createChart(c).then((chart) => {
          this.chart = chartConstructor(chart)
          this.toastSuccess(this.$t('notification.chart.saved'))
          if (closeOnSuccess) {
            this.redirect()
          } else {
            this.$router.push({ name: 'admin.charts.edit', params: { chartID: this.chart.chartID } })
          }
        }).catch(this.toastErrorHandler(this.$t('notification.chart.saveFailed')))
      } else {
        this.updateChart(c).then((chart) => {
          this.chart = chartConstructor(chart)
          this.toastSuccess(this.$t('notification.chart.saved'))
          if (closeOnSuccess) {
            this.redirect()
          }
        }).catch(this.toastErrorHandler(this.$t('notification.chart.saveFailed')))
      }
    },

    handleDelete () {
      this.deleteChart(this.chart).then(() => {
        this.toastSuccess(this.$t('notification.chart.deleted'))
        this.$router.push({ name: 'admin.charts' })
      }).catch(this.toastErrorHandler(this.$t('notification.chart.deleteFailed')))
    },

    redirect () {
      this.$router.push({ name: 'admin.charts' })
    },

    onEditReport (i) {
      this.editReportIndex = i
    },

    onRemoveReport (i) {
      this.reports.splice(i, 1)
      if (this.editReportIndex === i) {
        this.editReportIndex = undefined
      }
    },

    onAddReport () {
      this.reports.push(this.chart.defReport())
    },
  },
}
</script>
<style lang="scss" scoped>
.chart-preview {
  max-height: 50vh;
}

</style>
