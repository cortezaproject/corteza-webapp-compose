<template>
  <div class="storybook">
    <h1>Crust CRM Storybook / Charts</h1>

    <section>
      <form>
        <fieldset v-if="modules">
          <legend>Pick a module</legend>
          <b-form-select v-model="selectedModule" :options="modules" text-field="name" value-field="moduleID" ></b-form-select>
        </fieldset>
        <hr />
        <div v-if="!!module">
          <fieldset v-for="(m,i) in metrics" :key="'m'+i">
            <legend>Metrics (numeric fields) </legend>
            <b-form-group horizontal label="Label">
              <b-form-input v-model="m.label" placeholder="Total"></b-form-input>
            </b-form-group>
            <b-form-group horizontal label="Field">
              <b-form-select v-model="m.field" :options="metricFields" text-field="name" value-field="name"></b-form-select>
            </b-form-group>
            <b-form-group horizontal label="Function">
              <b-form-select v-model="m.function"
                             :disabled="!m.field || m.field === 'count'"
                             :options="metricFunctions"></b-form-select>
            </b-form-group>
            <b-form-group horizontal label="Output">
              <b-form-select v-model="m.type"
                               :disabled="!m.field"
                               :options="chartTypes"></b-form-select>
              <b-form-checkbox v-model="m.fill" :value="true" :unchecked-value="false"
                                 v-show="m.chartType === 'line'">Fill area below the line</b-form-checkbox>
            </b-form-group>
            <b-form-group horizontal>
              <b-row>
                <b-col sm="3"><b-form-input v-model="m.backgroundColor" type="color" ></b-form-input></b-col>
                <b-col>Background color</b-col>
              </b-row>
            </b-form-group>

            <b-button v-if="i>0" @click.prevent="metrics.splice(i)" class="float-right">Remove</b-button>
          </fieldset>
          <b-button @click.prevent="metrics.push({})">Add metrics</b-button>
          <hr />
          <fieldset v-for="(d,i) in dimensions" :key="'d'+i">
            <legend>Dimensions (datetime & select fields)</legend>
            <b-form-group horizontal label="Field">
              <b-form-select v-model="d.field" :options="dimensionFields" text-field="name" value-field="name"></b-form-select>
            </b-form-group>
            <b-form-group horizontal label="Function">
              <b-form-select v-model="d.modifier"
                             :disabled="!d.field || !isTemporalField(d.field)"
                             :options="dimensionModifiers"></b-form-select>
            </b-form-group>
          </fieldset>
        </div>
        <b-button @click.prevent="render" class="float-right">Render</b-button>
      </form>
      <div class="graph">
        <canvas ref="blockChart" width="200" height="200"></canvas>
        {{ metrics }}
        {{ dimensions }}
      </div>
    </section>
  </div>
</template>
<script>
import Field from '../../lib/field'
import Chart from 'chart.js'

export default {
  data () {
    return {
      metricFunctions: ['COUNTD', 'SUM', 'MAX', 'MIN', 'AVG', 'STD'],
      dimensionModifiers: ['', 'WEEKDAY', 'DATE', 'WEEK', 'MONTH', 'QUARTER', 'YEAR'],
      chartTypes: ['line', 'bar'],

      modules: [],
      selectedModule: null,

      metrics: [{ field: 'count' }],
      dimensions: [{ field: 'created_at', modifier: 'MONTH' }],

      chartOpt: {
        type: 'bar',
        data: {
          labels: [],
          datasets: [],
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
              },
            }],
          },
        },
      },

      chart: null,
    }
  },

  computed: {
    module () {
      if (!this.selectedModule || this.modules.length === 0) return null
      return this.modules.find(m => m.moduleID === this.selectedModule)
    },

    metricFields () {
      return [{ name: 'count' }, ...this.module.fields.filter(f => f.kind === 'Number')]
    },

    dimensionFields () {
      return [{ name: 'created_at' }, ...this.module.fields.filter(f => f.kind === 'DateTime' || f.kind === 'Select')]
    },
  },

  mounted () {
    this.$crm.moduleList({}).then(mm => {
      this.modules = mm.map(m => {
        if (!Array.isArray(m.fields)) {
          // In some cases, empty arrays are unmarshal as an empty object
          // and draggable component complains
          m.fields = []
        }

        m.fields = m.fields.map(f => new Field(f))
        return m
      })
    }).catch(this.defaultErrorHandler('Could not load module list'))
  },

  methods: {
    isTemporalField (name) {
      if (name === 'created_at') {
        return true
      }

      return !!this.module.fields.find(f => f.name === name && f.kind === 'DateTime')
    },

    render () {
      if (this.dimensions.length === 0 || this.metrics.length === 0) {
        return
      }

      if (!this.chart) {
        const ctx = this.$refs.blockChart.getContext('2d')
        this.chart = new Chart(ctx, this.chartOpt)
      }

      const req = {
        moduleID: this.selectedModule,

        // Remove count (we'll get it anyway) and construct FUNC(ARG) params
        metrics: this.metrics.filter(f => f.field !== 'count').map(m => `${m.function}(${m.field})`).join(','),

        // Construct dimensions \w modifiers...
        dimensions: this.dimensions.map(d => d.modifier ? `${d.field}|${d.modifier}` : d.field)[0],
      }

      this.$crm.moduleContentReport(req).then((rep) => {
        this.chartOpt.data.datasets = this.metrics.map(({ field, label, type, backgroundColor }, index) => {
          return {
            label,
            type,
            backgroundColor,
            data: rep.map(r => r[field === 'count' ? field : `metric_${index}`]),
          }
        })

        this.chartOpt.data.labels = rep.map(r => r['dimension_0'])

        this.chart.update()
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";

section {
  display: flex;
  flex-flow: row nowrap;

  form, .graph {
    background: $appcream;
    border-radius: 10px;
    border: 2px solid $appblue;
    margin: 20px;
    padding: 20px;
  }

  form {
    flex: 1;
    width: 400px;
  }

  .graph {
    flex: 2;
  }
}
</style>
