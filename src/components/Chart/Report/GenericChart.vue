<template>
  <report-edit
    :report.sync="editReport"
    :modules="modules"
    :dimension-field-kind="['Select']"
  >
    <template #y-axis="{ report }">
      <div class="border px-3 py-2 mb-2">
        <h5 class="mb-3">
          {{ $t('chart.edit.yAxis.label') }}
        </h5>
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
          class="mt-1"
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
    </template>
    <template #metric-options="{ metric }">
      <b-form-group
        horizontal
        :label-cols="2"
        class="mt-1"
        breakpoint="md"
        :label="$t('chart.edit.metric.labelLabel')"
      >
        <b-form-input
          v-model="metric.backgroundColor"
          type="color"
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

        <b-form-checkbox
          v-model="metric.fill"
          :value="true" :unchecked-value="false"
          v-show="metric.type === 'line'"
        >
          {{ $t('chart.edit.metric.fillArea') }}
        </b-form-checkbox>

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
    }
  },

  methods: {
    hasRelativeDisplay: compose.chartUtil.hasRelativeDisplay,
  },
}
</script>
