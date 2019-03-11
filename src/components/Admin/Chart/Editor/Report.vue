<template>
  <div class="col-md-6 well">
    <fieldset v-if="modules">
      <b-form-group>
        <b-form-select v-model="moduleID" :options="modules" text-field="name" value-field="moduleID">
          <template slot="first">
            <option :value="null" disabled>{{ $t('chart.edit.modulePick') }}</option>
          </template>
        </b-form-select>
      </b-form-group>
    </fieldset>

    <div v-if="!!module" class="report-config">
      <div class="filter">
        <h5>{{ $t('chart.edit.filter.label') }}</h5>
        <b-form-group>
          <b-form-select v-model="report.filter"
                         :disabled="customFilter"
                         :options="predefinedFilters">
            <template slot="first">
              <option :value="null">{{ $t('chart.edit.filter.noFilter') }}</option>
            </template>
          </b-form-select>
          <b-form-checkbox plain v-model="customFilter">{{ $t('chart.edit.filter.customize') }}</b-form-checkbox>
          <b-form-textarea v-if="customFilter"
                        v-model="report.filter"
                        placeholder="a = 1 AND b > 2"></b-form-textarea>

        </b-form-group>
      </div>
    </div>

    <div v-if="!!module" class="report-config">
      <div class="dimensions">
        <fieldset v-for="(d,i) in dimensions" :key="'d'+i">
          <h5> {{ $t('chart.edit.dimension.label') }} </h5>
          <b-form-group horizontal :label-cols="2" breakpoint="md" :label="$t('chart.edit.dimension.fieldLabel')">
            <b-form-select v-model="d.field"
                           :options="dimensionFields"
                           text-field="name"
                           value-field="name">
              <template slot="first">
                <option disabled :value="undefined">{{ $t('chart.edit.dimension.fieldPlaceholder') }}</option>
              </template>
            </b-form-select>
          </b-form-group>
          <b-form-group horizontal :label-cols="2" breakpoint="md" :label="$t('chart.edit.dimension.function.label')">
            <b-form-select v-model="d.modifier"
                           :disabled="!d.field || !isTemporalField(d.field)"
                           :options="dimensionModifiers">
              <template slot="first">
                <option disabled :value="undefined">{{ $t('chart.edit.dimension.function.placeholder') }}</option>
              </template>
            </b-form-select>
          </b-form-group>
          <b-form-group horizontal :label-cols="2" breakpoint="md">
            <b-form-checkbox plain v-model="d.skipMissing">{{ $t('chart.edit.dimension.skipMissingValues') }}</b-form-checkbox>
          </b-form-group>
          <b-form-group v-if="!d.skipMissing" horizontal :label-cols="2" breakpoint="md" :label="$t('chart.edit.dimension.defaultValueLabel')" :description="$t('chart.edit.dimension.defaultValueFootnote')">
            <b-form-input v-model="d.default" :type="defaultValueInputType(d)"></b-form-input>
          </b-form-group>
          <b-form-group horizontal :label-cols="2" breakpoint="md" label="">
            <b-form-checkbox plain v-model="d.autoSkip" :value="true" :unchecked-value="false">{{ $t('chart.edit.dimension.calculateLabelCount') }}</b-form-checkbox><br />
          </b-form-group>

          <!--<b-form-group horizontal v-if="d.field && isTemporalField(d.field)">-->
            <!--<b-form-input type="date" v-model="d.conditions.min"></b-form-input>-->
            <!--<b-form-input type="date" v-model="d.conditions.max"></b-form-input>-->
          <!--</b-form-group>-->
        </fieldset>
      </div>
      <draggable class="metrics" :list.sync="metrics" :options="{ group: 'metrics_'+moduleID, sort: true }">
        <fieldset v-for="(m,i) in metrics" :key="'m'+i" class="main-fieldset">
          <font-awesome-icon v-if="metrics.length>1" :icon="['fas', 'grip-vertical']"></font-awesome-icon>
          <h5>{{ $t('chart.edit.metric.label') }}</h5>
          <b-button v-if="metrics.length>1" @click.prevent="metrics.splice(i)" variant="url"><i class="action icon-trash"></i></b-button>
          <b-form horizontal class="color-picker" label="">
              <b-form-input v-model="m.backgroundColor" type="color" ></b-form-input>
          </b-form>

          <b-form-group horizontal :label-cols="2" breakpoint="md" :label="$t('chart.edit.metric.labelLabel')">
            <b-form-input v-model="m.label" :placeholder="$t('chart.edit.metric.labelPlaceholder')"></b-form-input>
          </b-form-group>
          <b-form-group horizontal :label-cols="2" breakpoint="md" :label="$t('chart.edit.metric.fieldLabel')">
            <b-form-select v-model="m.field" :options="metricFields" text-field="name" value-field="name">
              <template slot="first">
                <option disabled :value="undefined">{{ $t('chart.edit.metric.fieldPlaceholder') }}</option>
              </template>
            </b-form-select>
          </b-form-group>

          <b-form-group horizontal :label-cols="2" breakpoint="md" :label="$t('chart.edit.metric.function.label')">
            <b-form-select v-model="m.aggregate"
                           :disabled="!m.field || m.field === 'count'"
                           :options="metricAggregates">
              <template slot="first">
                <option disabled :value="undefined">{{ $t('chart.edit.metric.function.placeholder') }}</option>
              </template>
            </b-form-select>
          </b-form-group>

          <b-form-group horizontal :label-cols="2" breakpoint="md" :label="$t('chart.edit.metric.output.label')">
            <b-form-select v-model="m.type"
                           :disabled="!m.field"
                           :options="chartTypes">
              <template slot="first">
                <option disabled :value="undefined">{{ $t('chart.edit.metric.output.placeholder') }}</option>
              </template>
            </b-form-select>
          </b-form-group>
          <b-form-group horizontal :label-cols="2" breakpoint="md" label="">
            <b-form-checkbox plain v-model="m.axisType" value="logarithmic" unchecked-value="linear">{{ $t('chart.edit.metric.logarithmicScale') }}</b-form-checkbox><br />
            <b-form-checkbox plain v-model="m.axisPosition" value="right" unchecked-value="left">{{ $t('chart.edit.metric.axisOnRight') }}</b-form-checkbox><br />
            <b-form-checkbox plain v-model="m.beginAtZero" :value="true" :unchecked-value="false" checked>{{ $t('chart.edit.metric.axisScaleFromZero') }}</b-form-checkbox><br />
            <b-form-checkbox plain v-model="m.fill" :value="true" :unchecked-value="false"
                             v-show="m.type === 'line'">{{ $t('chart.edit.metric.fillArea') }}</b-form-checkbox>
          </b-form-group>
        </fieldset>
      </draggable>
    </div>
    <b-button @click.prevent="metrics.push({})" variant="url" class="float-right">+ {{ $t('chart.edit.metric.add') }}</b-button>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { VueSelect } from 'vue-select'
import { chartTypes, aggregateFunctions, dimensionFunctions, predefinedFilters } from '@/lib/chart'

export default {
  name: 'Report',

  components: {
    draggable,
    VueSelect,
  },

  props: {
    report: {
      type: [Object, undefined],
      required: false,
    },

    modules: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      customFilter: false,

      metricAggregates: aggregateFunctions.map(af => ({ ...af, text: this.$t(`chart.edit.metric.function.${af.text}`) })),
      dimensionModifiers: dimensionFunctions.map(df => ({ ...df, text: this.$t(`chart.edit.dimension.function.${df.text}`) })),
      predefinedFilters: predefinedFilters.map(pf => ({ ...pf, text: this.$t(`chart.edit.filter.${pf.text}`) })),
      chartTypes: chartTypes.map(ct => ({ ...ct, text: this.$t(`chart.edit.metric.output.${ct.text}`) })),
    }
  },

  computed: {
    defaultValueInputType () {
      return ({ field }) => field === 'created_at' || (this.module.fields.filter(f => f.name === field)[0] || {}).kind === 'DateTime' ? 'date' : 'text'
    },

    module () {
      return this.modules.find(m => m.moduleID === this.moduleID)
    },

    metricFields () {
      return [{ name: 'count' }, ...this.module.fields.filter(f => f.kind === 'Number')]
    },

    dimensionFields () {
      return [{ name: 'created_at' }, ...this.module.fields.filter(f => f.kind === 'DateTime' || f.kind === 'Select')]
    },

    moduleID: {
      get () {
        return this.report.moduleID
      },

      set (v) {
        this.report.moduleID = v
        this.$emit('update:report', { ...this.report, moduleID: v })
      },
    },

    metrics: {
      get () {
        return this.report.metrics
      },

      set (v) {
        this.report.metrics = v
        this.$emit('update:report', { ...this.report, metrics: v })
      },
    },

    dimensions: {
      get () {
        return this.report.dimensions
      },

      set (v) {
        // this.report.dimensions = v
        this.$emit('update:report', { ...this.report, dimensions: v })
      },
    },
  },

  watch: {
    'report.filter' (v) {
      this.customFilter = !predefinedFilters.includes(v)
    },
  },

  methods: {
    isTemporalField (name) {
      if (name === 'created_at') {
        return true
      }

      return !!this.module.fields.find(f => f.name === name && f.kind === 'DateTime')
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

.report-config {
  margin-top: 5px;

  .filter,
  .metrics,
  .dimensions {
    margin: 2px;
    padding: 15px 20px;
    border: 1px solid $appcream;

    .form-group {
      padding-right: 15px;
    }
  }

  h5 {
    margin-bottom: 15px;
    font-weight: 900;
  }

  .metrics {
    h5 {
      display: inline-block;
    }

    p {
      margin: 5px 5px 0 0;
    }
  }

  .dimensions {
    margin: 10px 0;
  }

  input.form-control[type="color"] {
    padding: 0;
    border: none;
    height: 30px;
    width: 30px;
    background: transparent;
  }

  .color-picker {
    margin: 0 15px;
    float: right;
  }

  .main-fieldset {
    border-top: 1px solid $appcream;
    padding-top: 15px;
    margin-top: 10px;

    &:first-child {
      border: none;
      padding-top: 0;
    }

    .btn-url {
      color: $appred;
      text-decoration: none;
      margin-left: 5px;
    }

    .fa-grip-vertical {
      position: absolute;
      left: 25px;
      color: $appgrey;
      cursor: move;
      margin-top: 4px;
      font-size: 12px;
    }
  }
}
</style>
