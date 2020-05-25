<template>
  <div>
    <b-tab
      :title="$t('block.metric.edit.tabTitle')"
    >
      <b-row>
        <b-col cols="12">
          <div
            v-for="(m, i) in metrics"
            :key="m.label + i"
            class="mb-2"
          >
            <b-btn
              variant="primary"
              class="mr-1"
              @click="editMetric(m)"
            >
              {{ $t('general.label.edit') }}
            </b-btn>
            <b-btn
              variant="outline-danger"
              class="mr-2"
              @click="removeMetric(i)"
            >
              {{ $t('general.label.remove') }}
            </b-btn>

            <span>
              {{ m.label || $t('block.metric.defaultMetricLabel') }}
            </span>
          </div>

          <b-btn
            variant="link"
            v-if="canAdd"
            @click="addMetric"
          >
            + {{ $t('general.label.add') }}
          </b-btn>
        </b-col>
      </b-row>

      <b-row>
        <!-- edit metric -->
        <b-col
          v-if="edit"
          cols="12"
          md="7"
        >
          <b-card
            class="mb-5"
          >
            <fieldset>
              <b-form-group
                :label="$t('block.metric.edit.labelLabel')"
              >
                <b-form-input
                  v-model="edit.label"
                  :placeholder="$t('block.metric.edit.labelPlaceholder')"
                  class="mb-1"
                />
              </b-form-group>
            </fieldset>

            <fieldset>
              <h5>
                {{ $t('block.metric.edit.dimensionLabel') }}
              </h5>
              <b-form-group
                :label="$t('block.metric.edit.moduleLabel')"
                label-cols="2"
              >
                <b-form-select
                  v-model="edit.moduleID"
                  :options="modules"
                  text-field="name"
                  class="mt-1"
                  value-field="moduleID"
                >
                  <template slot="first">
                    <option
                      :value="undefined"
                      disabled
                    >
                      {{ $t('block.metric.edit.modulePlaceholder') }}
                    </option>
                  </template>
                </b-form-select>
              </b-form-group>

              <!-- <b-form-group
                :label="$t('block.metric.edit.dimensionFieldLabel')"
                label-cols="2"
              >
                <b-form-select
                  v-model="edit.dimensionField"
                  :options="fields"
                  class="mt-1"
                  text-field="label"
                  value-field="name"
                >
                  <template slot="first">
                    <option
                      :value="undefined"
                      disabled
                    >
                      {{ $t('block.metric.edit.dimensionFieldPlaceholder') }}
                    </option>
                  </template>
                </b-form-select>
              </b-form-group>

              <template>
                <b-form-group
                  :label="$t('block.metric.edit.dateFormat')"
                  label-cols="2"
                >
                  <b-form-input
                    v-model="edit.dateFormat"
                    :disabled="!edit.dimensionField || !isTemporalField(edit.dimensionField)"
                    placeholder="YYYY-MM-DD"
                    class="mb-1"
                  />
                </b-form-group>

                <b-form-group
                  :label="$t('block.metric.edit.bucketLabel')"
                  label-cols="2"
                >
                  <b-form-select
                    v-model="edit.bucketSize"
                    :disabled="!edit.dimensionField || !isTemporalField(edit.dimensionField)"
                    :options="dimensionModifiers"
                  >
                    <template slot="first">
                      <option
                        disabled
                        :value="undefined"
                      >
                        {{ $t('block.metric.edit.bucketPlaceholder') }}
                      </option>
                    </template>
                  </b-form-select>
                </b-form-group>
              </template> -->

              <b-form-group
                :label="$t('block.metric.edit.filterLabel')"
                label-cols="2"
              >
                <b-form-textarea
                  v-model="edit.filter"
                  placeholder="(A > B) OR (A < C)"
                  class="mb-1"
                />
              </b-form-group>
            </fieldset>

            <fieldset>
              <h5>
                {{ $t('block.metric.edit.metricLabel') }}
              </h5>

              <b-form-group
                :label="$t('block.metric.edit.metricFieldLabel')"
                label-cols="2"
              >
                <b-form-select
                  v-model="edit.metricField"
                  :options="metricFields"
                  text-field="name"
                  value-field="name"
                >
                  <template slot="first">
                    <option
                      disabled
                      :value="undefined"
                    >
                      {{ $t('block.metric.edit.metricFieldPlaceholder') }}
                    </option>
                  </template>
                </b-form-select>
              </b-form-group>

              <b-form-group
                :label="$t('block.metric.edit.operationLabel')"
                label-cols="2"
              >
                <b-form-select
                  v-model="edit.operation"
                  :disabled="edit.metricField === 'count'"
                  :options="operations"
                  class="mt-1"
                >
                  <template slot="first">
                    <option
                      :value="undefined"
                      disabled
                    >
                      {{ $t('block.metric.edit.operationPlaceholder') }}
                    </option>
                  </template>
                </b-form-select>
              </b-form-group>

              <b-form-group
                :label="$t('block.metric.edit.transformFunctionLabel')"
                :description="$t('block.metric.edit.transformFunctionDescription')"
                label-cols="2"
              >
                <b-form-textarea
                  v-model="edit.transformFx"
                  placeholder="v"
                  class="mb-1"
                />
              </b-form-group>

              <b-form-group
                :label="$t('block.metric.edit.numberFormat')"
                label-cols="2"
              >
                <b-form-input
                  v-model="edit.numberFormat"
                  placeholder="0.00"
                  class="mb-1"
                />
              </b-form-group>

              <b-form-group
                :label="$t('block.metric.edit.prefixLabel')"
                label-cols="2"
              >
                <b-form-input
                  v-model="edit.prefix"
                  placeholder="$"
                  class="mb-1"
                />
              </b-form-group>

              <b-form-group
                :label="$t('block.metric.edit.suffixLabel')"
                label-cols="2"
              >
                <b-form-input
                  v-model="edit.suffix"
                  placeholder="USD/mo"
                  class="mb-1"
                />
              </b-form-group>
            </fieldset>
          </b-card>

          <!-- <m-style :options="edit.labelStyle">
            <h5 slot="title">
              {{ $t('block.metric.editStyle.labelLabel') }}
            </h5>
          </m-style> -->
          <m-style
            class="mt-2"
            :options="edit.valueStyle"
          >
            <h5 slot="title">
              {{ $t('block.metric.editStyle.valueLabel') }}
            </h5>
          </m-style>
        </b-col>

        <b-col cols="12" md="5">
          <b-card>
            <div class="text-right">
              <b-btn
                variant="outline-primary"
                @click="$root.$emit('metric.update')"
              >
                {{ $t('block.metric.edit.refreshData') }}
              </b-btn>
            </div>

            <metric-base
              class="mt-2"
              v-bind="$props"
            />
          </b-card>
        </b-col>
      </b-row>
    </b-tab>
  </div>
</template>

<script>
import base from '../base'
import MStyle from './MStyle'
import { mapGetters } from 'vuex'
import MetricBase from '../MetricBase'
import { compose } from '@cortezaproject/corteza-js'

export default {
  name: 'Metric',
  components: {
    MStyle,
    MetricBase,
  },
  extends: base,

  data () {
    return {
      edit: undefined,
      dimensionModifiers: compose.chartUtil.dimensionFunctions.map(df => ({ ...df, text: this.$t(`chart.edit.dimension.function.${df.text}`) })),
      operations: [
        {
          value: 'countd',
          text: this.$t('block.metric.edit.operationCountd'),
        },
        {
          value: 'sum',
          text: this.$t('block.metric.edit.operationSum'),
        },
        {
          value: 'max',
          text: this.$t('block.metric.edit.operationMax'),
        },
        {
          value: 'min',
          text: this.$t('block.metric.edit.operationMin'),
        },
        {
          value: 'avg',
          text: this.$t('block.metric.edit.operationAvg'),
        },
      ],
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
      moduleByID: 'module/getByID',
    }),

    fields () {
      if (!this.edit || !this.edit.moduleID) {
        return []
      }

      return this.moduleByID(this.edit.moduleID).fields.concat([{ name: 'created_at', label: 'Created At', kind: 'DateTime' }])
    },

    metricFields () {
      return [{ name: 'count' }, ...this.fields.filter(f => f.kind === 'Number')]
    },

    metrics: {
      get () {
        return this.options.metrics
      },
      set (m) {
        this.options.metrics = m
      },
    },

    canAdd () {
      // if any label is not defined, then the metric is considered invalid
      return this.metrics.reduce((acc, m) => acc && m.label, true)
    },
  },

  watch: {
    'edit.dimensionField': function (df) {
      if (!this.isTemporalField(df)) {
        this.edit.bucketSize = undefined
        this.edit.dateFormat = undefined
      } else {
        this.edit.dateFormat = this.edit.dateFormat || 'YYYY-MM-DD'
      }
    },
    'edit.metricField': function (mf) {
      if (mf === 'count') {
        this.edit.operation = undefined
      }
    },
  },

  created () {
    if (!this.metrics.length) {
      this.addMetric()
    }

    this.edit = this.metrics[0]
  },

  methods: {
    addMetric () {
      const m = {
        labelStyle: {},
        valueStyle: {},
      }
      this.metrics.push(m)
      this.editMetric(m)
    },

    editMetric (m) {
      this.edit = m
    },

    removeMetric (i) {
      this.metrics.splice(i, 1)
      this.edit = undefined
    },

    isTemporalField (name) {
      if (name === 'created_at') {
        return true
      }

      return !!this.fields.find(f => f.name === name && f.kind === 'DateTime')
    },
  },
}
</script>
