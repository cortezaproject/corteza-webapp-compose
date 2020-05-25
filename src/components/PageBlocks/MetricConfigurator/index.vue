<template>
  <div>
    <b-tab title="Metric">
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
            <h5>
              {{ $t('block.metric.edit.editLabel') }}
            </h5>

            <fieldset>
              <b-form-group>
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

              <b-form-group
                :label="$t('block.metric.edit.labelLabel')"
                label-cols="2"
              >
                <b-form-input
                  v-model="edit.label"
                  :placeholder="$t('block.metric.edit.labelPlaceholder')"
                  class="mb-1"
                />
              </b-form-group>

              <b-form-group
                :label="$t('block.metric.edit.operationLabel')"
                label-cols="2"
              >
                <b-form-select
                  v-model="edit.operation"
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
                :label="$t('block.metric.edit.dateFormat')"
                label-cols="2"
              >
                <b-form-input
                  v-model="edit.dateFormat"
                  placeholder="YYYY-MM-DD"
                  class="mb-1"
                />
              </b-form-group>

              <b-form-group
                :label="$t('block.metric.edit.filterLabel')"
                label-cols="2"
              >
                <b-form-input
                  v-model="edit.filter"
                  placeholder="(A > B) OR (A < C)"
                  class="mb-1"
                />
              </b-form-group>

              <b-form-group
                :label="$t('block.metric.edit.bucketLabel')"
                label-cols="2"
              >
                <b-form-select
                  v-model="edit.bucketSize"
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
            </fieldset>
          </b-card>

          <m-style :options="edit.labelStyle">
            <h5 slot="title">
              {{ $t('block.metric.editStyle.labelLabel') }}
            </h5>
          </m-style>
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
            <metric-base
              v-bind="$props"
              preview-mode
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
        { text: this.$t('block.metric.edit.operationCount'), value: 'countd' },
      ],
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

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
  },
}
</script>
