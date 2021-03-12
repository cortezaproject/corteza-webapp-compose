<template>
  <report-edit
    :report.sync="editReport"
    :modules="modules"
  >
    <template #y-axis="{ report }">
      <hr>
      <div>
        <h4 class="mb-3">
          {{ $t('chart.edit.yAxis.label') }}
        </h4>
        <b-form-checkbox
          v-model="report.yAxis.axisType"
          value="logarithmic"
          unchecked-value="linear"
        >
          {{ $t('chart.edit.yAxis.logarithmicScale') }}
        </b-form-checkbox>

        <b-form-checkbox
          v-model="report.yAxis.axisPosition"
          value="right"
          unchecked-value="left"
        >
          {{ $t('chart.edit.yAxis.axisOnRight') }}
        </b-form-checkbox>

        <b-form-checkbox
          v-model="report.yAxis.beginAtZero"
          :value="true"
          :unchecked-value="false"
          checked
        >
          {{ $t('chart.edit.yAxis.axisScaleFromZero') }}
        </b-form-checkbox>

        <b-form-group
          horizontal
          :label-cols="2"
          class="mt-2"
          breakpoint="md"
          :label="$t('chart.edit.yAxis.labelLabel')"
        >
          <b-form-input
            v-model="report.yAxis.label"
            :placeholder="$t('chart.edit.yAxis.labelPlaceholder')"
          />
        </b-form-group>

        <b-form-group
          horizontal
          :label-cols="2"
          class="mt-1"
          breakpoint="md"
          :label="$t('chart.edit.yAxis.minLabel')"
        >
          <b-form-input
            v-model="report.yAxis.min"
            :placeholder="$t('chart.edit.yAxis.minPlaceholder')"
          />
        </b-form-group>
        <b-form-group
          horizontal
          :label-cols="2"
          class="mt-1"
          breakpoint="md"
          :label="$t('chart.edit.yAxis.maxLabel')"
        >
          <b-form-input
            v-model="report.yAxis.max"
            :placeholder="$t('chart.edit.yAxis.maxPlaceholder')"
          />
        </b-form-group>
      </div>
      <hr>
    </template>
    <template #metric-options="{ metric }">
      <b-form-group
        horizontal
        :label-cols="2"
        breakpoint="md"
        :label="$t('chart.edit.metric.labelColor')"
      >
        <b-form-input
          v-model="metric.backgroundColor"
          type="color"
          class="color-picker"
        />
      </b-form-group>

      <b-form-group
        horizontal
        :label-cols="2"
        class="mt-1"
        breakpoint="md"
        :label="$t('chart.edit.metric.labelLabel')"
      >
        <b-form-input
          v-model="metric.label"
          :placeholder="$t('chart.edit.metric.labelPlaceholder')"
        />
      </b-form-group>

      <b-form-group
        horizontal
        :label-cols="2"
        breakpoint="md"
        :label="$t('chart.edit.metric.fx.label')"
        :description="$t('chart.edit.metric.fx.description')"
      >
        <b-form-textarea
          v-model="metric.fx"
          placeholder="n"
        />
      </b-form-group>

      <b-form-group
        horizontal
        :label-cols="2"
        breakpoint="md"
        :label="$t('chart.edit.metric.output.label')"
      >
        <b-form-select
          v-model="metric.type"
          :disabled="!metric.field"
          :options="chartTypes"
        >
          <template slot="first">
            <option
              disabled
              :value="undefined"
            >
              {{ $t('chart.edit.metric.output.placeholder') }}
            </option>
          </template>
        </b-form-select>
      </b-form-group>

      <b-form-group
        horizontal
        :label-cols="2"
        breakpoint="md"
        label=""
      >
        <template v-if="hasRelativeDisplay(metric)">
          <template v-if="metric.type === 'pie' || metric.type === 'doughnut'">
            <b-form-select
              v-model="metric.legendPosition"
              :options="legendPositions"
            >
              <template slot="first">
                <option
                  disabled
                  :value="undefined"
                >
                  {{ $t('chart.edit.metric.legend.positionPlaceholder') }}
                </option>
              </template>
            </b-form-select>
          </template>

          <b-form-checkbox
            v-model="metric.relativeValue"
            :value="true"
            :unchecked-value="false"
          >
            {{ $t('chart.edit.metric.relative') }}
          </b-form-checkbox>

          <template v-if="metric.relativeValue">
            <b-form-group
              horizontal
              breakpoint="md"
              :label="$t('chart.edit.metric.relativePrecision')"
            >

              <b-form-input
                v-model="metric.relativePrecision"
                type="number"
                placeholder="2"
              />
            </b-form-group>
          </template>
        </template>

        <template v-if="metric.type === 'line'">
          <b-form-checkbox
            v-model="metric.fill"
            :value="true" :unchecked-value="false"
          >
            {{ $t('chart.edit.metric.fillArea') }}
          </b-form-checkbox>

          <b-form-group
            horizontal
            breakpoint="md"
            :label="$t('chart.edit.metric.lineTension.label')"
          >
            <b-form-select
              v-model="metric.lineTension"
              :options="tensionSteps"
            >
              <template slot="first">
                <option
                  disabled
                  :value="undefined"
                >
                  {{ $t('chart.edit.metric.lineTension.placeholder') }}
                </option>
              </template>
            </b-form-select>
          </b-form-group>
        </template>

        <b-form-checkbox
          v-model="metric.fixTooltips"
          :value="true"
          :unchecked-value="false"
        >
          {{ $t('chart.edit.metric.fixTooltips') }}
        </b-form-checkbox>
      </b-form-group>
    </template>
  </report-edit>
</template>

<script>
import ReportEdit from './ReportEdit'
import { compose } from '@cortezaproject/corteza-js'
import base from './base'

const ignoredCharts = [
  'funnel',
  'gauge',
]

export default {
  components: {
    ReportEdit,
  },

  extends: base,

  data () {
    return {
      chartTypes: Object.values(compose.chartUtil.ChartType)
        .filter(v => !ignoredCharts.includes(v))
        .map(value => ({ value, text: this.$t(`chart.edit.metric.output.${value}`) })),

      legendPositions: [
        { value: 'top', text: this.$t('chart.edit.metric.legend.top') },
        { value: 'left', text: this.$t('chart.edit.metric.legend.left') },
        { value: 'bottom', text: this.$t('chart.edit.metric.legend.bottom') },
        { value: 'right', text: this.$t('chart.edit.metric.legend.right') },
      ],
    }
  },

  computed: {
    tensionSteps () {
      return [
        { text: this.$t('chart.edit.metric.lineTension.straight'), value: 0.0 },
        { text: this.$t('chart.edit.metric.lineTension.slight'), value: 0.2 },
        { text: this.$t('chart.edit.metric.lineTension.medium'), value: 0.4 },
        { text: this.$t('chart.edit.metric.lineTension.curvy'), value: 0.6 },
      ]
    },
  },

  methods: {
    hasRelativeDisplay: compose.chartUtil.hasRelativeDisplay,
  },
}
</script>
<style lang="scss" scoped>
.color-picker {
  max-width: 50px;
}
</style>
