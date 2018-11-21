<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Edit chart</h2>
          <div v-if="editChartError" style="color:red;">
            {{ editChartError }}
          </div>
          <form v-if="!editChartError" @submit.prevent="FormSubmit">
            <input required type="hidden" v-model="editChartFormData.id" id="id" />
            <div class="form-group">
              <label for="name">Chart name</label>
              <input required type="text" v-model="addChartFormData.name" class="form-control" id="name" placeholder="Chart name" />
            </div>
            <div class="form-group">
              <label for="title">Description</label>
              <textarea v-model="addChartFormData.description" class="form-control" id="description" placeholder="Chart description" />
            </div>
            <div class="form-group">
              <label for="module">Chart type</label>
              <select v-model="addChartFormData.type" class="form-control" id="type">
                <option value=""></option>
                <option value="line">Line</option>
                <option value="spline">Spline</option>
                <option value="step">Step</option>
                <option value="area">Area</option>
                <option value="area-spline">Area-spline</option>
                <option value="area-step">Area-step</option>
                <option value="bar">Bar</option>
                <option value="scatter">Scatter</option>
                <option value="pie">Pie</option>
                <option value="donut">Donut</option>
                <option value="gauge">Gauge</option>
              </select>
            </div>
            <div class="form-group">
              <label for="module">Module</label>
              <select v-model="addChartFormData.moduleID" class="form-control" id="module">
                <option :value="null"></option>
              </select>
            </div>
            <div class="form-group">
              <label for="x">X-Axis</label>
              <select v-model="addChartFormData.x" class="form-control" id="x">
                <option :value="null"></option>
              </select>
            </div>
            <div class="form-group">
              <div class="row">
                <div class="col-md-6">
                  <label for="x">X-Axis</label>
                  <select v-model="addChartFormData.x" class="form-control" id="x">
                    <option :value="null"></option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="xmin">X-Axis Min</label>: <input type="text" v-model="addChartFormData.xMin" class="form-control" id="xmin" placeholder="Min" /><br>
                  <label for="xmax">X-Axis Max</label>: <input type="text" v-model="addChartFormData.xMax" class="form-control" id="xmax" placeholder="Max" />
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="y">Y-Axis</label>
              <select v-model="addChartFormData.y" class="form-control" id="y">
                <option :value="null"></option>
              </select>
            </div>
            <div class="form-group">
              <label for="groupby">Group by</label>
              <select v-model="addChartFormData.groupBy" class="form-control" id="groupby">
                <option :value="null"></option>
              </select>
            </div>
            <div class="form-group">
              <label for="sum">Sum</label>
              <select v-model="addChartFormData.sum" class="form-control" id="sum">
                <option :value="null"></option>
              </select>
            </div>
            <div class="form-group">
              <label for="count">Count</label>
              <select v-model="addChartFormData.count" class="form-control" id="count">
                <option :value="null"></option>
              </select>
            </div>

            <div v-if="editChartFormSubmitError" style="color:red;">
              {{ editChartFormSubmitError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chartID: {
      type: String,
    },
  },

  name: 'ChartEdit',
  data () {
    return {
      editChartError: '',
      editChartFormSubmitError: '',
      fieldsList: [],
      editChartFormData: {
        name: '',
      },
    }
  },
  async created () {
    try {
      this.editChartError = ''
      var req = {
        chartID: this.chartID,
      }
      this.editChartFormData = await this.$crm.chartRead(req)
    } catch (e) {
      this.editChartError = 'Error when trying to init chart form.'
    }
  },
  computed: {
  },
  methods: {
    redirect () {
      this.$router.push({ name: 'admin.charts' })
    },
    async FormSubmit () {
      try {
        this.editChartFormSubmitError = ''
        await this.$crm.chartEdit(this.editChartFormData)
        this.redirect()
      } catch (e) {
        this.editChartFormSubmitError = 'Error when trying to edit chart.'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.table th,
.table td,
.table tr {
  padding: 3px;
}
</style>
