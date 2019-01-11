<template>
  <div class="col-md-6 well">
    <fieldset v-if="modules">
      <b-form-group>
        <b-form-select v-model="moduleID" :options="modules" text-field="name" value-field="moduleID">
          <template slot="first">
            <option :value="null" disabled>Pick a module</option>
          </template>
        </b-form-select>
      </b-form-group>
    </fieldset>

    <div v-if="!!module" class="report-config">
      <div class="filter">
        <h5>Filters</h5>
        <b-form-group>
          <b-form-select v-model="report.filter"
                         :disabled="customFilter"
                         :options="predefinedFilters">
            <template slot="first">
              <option :value="null" disabled>(no filter)</option>
            </template>
          </b-form-select>
          <b-form-checkbox plain v-model="customFilter">Customize filter</b-form-checkbox>
          <b-form-textarea v-if="customFilter"
                        v-model="report.filter"
                        placeholder="a = 1 AND b > 2"></b-form-textarea>

        </b-form-group>
      </div>
    </div>

    <div v-if="!!module" class="report-config">
      <div class="dimensions">
        <fieldset v-for="(d,i) in dimensions" :key="'d'+i">
          <h5>Dimensions (datetime & select fields)</h5>
          <b-form-group horizontal :label-cols="2" breakpoint="md" label="Field">
            <b-form-select v-model="d.field"
                           :options="dimensionFields"
                           text-field="name"
                           value-field="name">
              <template slot="first">
                <option disabled :value="undefined">Select a dimension field</option>
              </template>
            </b-form-select>
          </b-form-group>
          <b-form-group horizontal :label-cols="2" breakpoint="md" label="Function">
            <b-form-select v-model="d.modifier"
                           :disabled="!d.field || !isTemporalField(d.field)"
                           :options="dimensionModifiers">
              <template slot="first">
                <option disabled :value="undefined">Select dimension modifier (bucket size)</option>
              </template>
            </b-form-select>
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
          <h5>Metrics (numeric fields) </h5>
          <b-button v-if="metrics.length>1" @click.prevent="metrics.splice(i)" variant="url"><i class="action icon-trash"></i></b-button>
          <b-form horizontal class="color-picker" label="">
              <b-form-input v-model="m.backgroundColor" type="color" ></b-form-input>
          </b-form>

          <b-form-group horizontal :label-cols="2" breakpoint="md" label="Label">
            <b-form-input v-model="m.label" placeholder="Total"></b-form-input>
          </b-form-group>
          <b-form-group horizontal :label-cols="2" breakpoint="md" label="Field">
            <b-form-select v-model="m.field" :options="metricFields" text-field="name" value-field="name">
              <template slot="first">
                <option disabled :value="undefined">Select metric field</option>
              </template>
            </b-form-select>
          </b-form-group>

          <b-form-group horizontal :label-cols="2" breakpoint="md" label="Function">
            <b-form-select v-model="m.aggregate"
                           :disabled="!m.field || m.field === 'count'"
                           :options="metricAggregates">
              <template slot="first">
                <option disabled :value="undefined">Select metric aggregate function</option>
              </template>
            </b-form-select>
          </b-form-group>

          <b-form-group horizontal :label-cols="2" breakpoint="md" label="Output">
            <b-form-select v-model="m.type"
                           :disabled="!m.field"
                           :options="chartTypes">
              <template slot="first">
                <option disabled :value="undefined">Select metric output</option>
              </template>
            </b-form-select>
          </b-form-group>
          <b-form-group stacked :label-cols="2" breakpoint="md" label="">
            <b-form-checkbox plain v-model="m.fill" :value="true" :unchecked-value="false"
                             v-show="m.type === 'line'">Fill area below the line</b-form-checkbox>
            <b-form-checkbox plain v-model="m.axisType" value="logarithmic" unchecked-value="linear">Logarithmic scale</b-form-checkbox>
            <b-form-checkbox plain v-model="m.axisPosition" value="right" unchecked-value="left">Place axis on the right side</b-form-checkbox>
          </b-form-group>
        </fieldset>
      </draggable>
    </div>
    <b-button @click.prevent="metrics.push({})" variant="url" class="float-right">+ Add metric</b-button>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { VueSelect } from 'vue-select'
import { dimensionFunctions, predefinedFilters } from '@/lib/chart'

export default {
  name: 'Report',

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

  computed: {
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

  data () {
    return {
      customFilter: false,

      metricAggregates: ['COUNTD', 'SUM', 'MAX', 'MIN', 'AVG', 'STD'],
      dimensionModifiers: dimensionFunctions.map(df => df.label),
      predefinedFilters: predefinedFilters,
      chartTypes: ['line', 'bar'],
    }
  },

  methods: {
    isTemporalField (name) {
      if (name === 'created_at') {
        return true
      }

      return !!this.module.fields.find(f => f.name === name && f.kind === 'DateTime')
    },
  },

  components: {
    draggable,
    VueSelect,
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
