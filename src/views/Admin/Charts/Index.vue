<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Create a new chart</h2>
          <form @submit.prevent="handleAddChartFormSubmit">
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
              <select v-model="addChartFormData.moduleID" class="form-control" id="module" @change="fillFieldSelects(addChartFormData.moduleID)">
                <option :value="null"></option>
                <option v-for="(moduleSelectOption, index) in moduleSelectOptions" :value="moduleSelectOption.id" v-bind:index="index" v-bind:key="moduleSelectOption.id">{{ moduleSelectOption.name }}</option>
              </select>
              <div v-if="moduleSelectError" style="color:red;">
                {{ moduleSelectError }}
              </div>
              <div v-if="fillFieldSelectsError" style="color:red;">
                {{ fillFieldSelectsError }}
              </div>
            </div>
            <div class="form-group">
              <div class="row">
                <div class="col-md-6">
                  <label for="x">X-Axis</label>
                  <select v-model="addChartFormData.x" class="form-control" id="x">
                    <option :value="null"></option>
                    <option v-for="(moduleFieldSelectOption, index) in moduleFieldsSelectOptions.fields" :value="moduleFieldSelectOption.id" v-bind:index="index" v-bind:key="moduleFieldSelectOption.id">{{ moduleFieldSelectOption.name }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="xmin">X-Axis Min</label>: <input ref="selectXMin" type="text" v-model="addChartFormData.xMin" class="form-control" id="xmin" placeholder="Min" /><br>
                  <label for="xmax">X-Axis Max</label>: <input ref="selectXMax" type="text" v-model="addChartFormData.xMax" class="form-control" id="xmax" placeholder="Max" />
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="y">Y-Axis</label>
              <select ref="selectY" v-model="addChartFormData.y" class="form-control" id="y">
                <option :value="null"></option>
                <option v-for="(moduleFieldSelectOption, index) in moduleFieldsSelectOptions.fields" :value="moduleFieldSelectOption.id" v-bind:index="index" v-bind:key="moduleFieldSelectOption.id">{{ moduleFieldSelectOption.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label ref="selectGroupBy" for="groupby">Group by</label>
              <select v-model="addChartFormData.groupBy" class="form-control" id="groupby">
                <option :value="null"></option>
                <option v-for="(moduleFieldSelectOption, index) in moduleFieldsSelectOptions.fields" :value="moduleFieldSelectOption.id" v-bind:index="index" v-bind:key="moduleFieldSelectOption.id">{{ moduleFieldSelectOption.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label ref="selectSum" for="sum">Sum</label>
              <select v-model="addChartFormData.sum" class="form-control" id="sum">
                <option :value="null"></option>
                <option v-for="(moduleFieldSelectOption, index) in moduleFieldsSelectOptions.fields" :value="moduleFieldSelectOption.id" v-bind:index="index" v-bind:key="moduleFieldSelectOption.id">{{ moduleFieldSelectOption.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label ref="selectCount" for="count">Count</label>
              <select v-model="addChartFormData.count" class="form-control" id="count">
                <option :value="null"></option>
                <option v-for="(moduleFieldSelectOption, index) in moduleFieldsSelectOptions.fields" :value="moduleFieldSelectOption.id" v-bind:index="index" v-bind:key="moduleFieldSelectOption.id">{{ moduleFieldSelectOption.name }}</option>
              </select>
            </div>
            <button type="submit" class="btn btn-dark large">Create</button>
            <div v-if="addChartFormSubmitError" style="color:red;">
              {{ addChartFormSubmitError }}
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h2>List of charts</h2>
        <div v-if="deleteChartError" style="color:red;">
          {{ deleteChartError }}
        </div>
        <table class="table table-striped">
          <tbody>
            <tr v-for="(chart, index) in list" :key="index">
              <td>{{ chart.name }}</td>
              <td>(Updated at : {{ chart.updatedAt }})</td>
              <td class="text-right actions">
                <router-link
                        :to="{name: 'chart.links.edit', params: { chartID: chart.id }}"
                        class="action">Edit data</router-link>
                <button class="btn btn-secondary action" v-on:click="handleDeleteChart(chart.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="listError" style="color:red;">
          {{ listError }}
        </div>
      </div>
    </div>
    <b-modal ref="myDeleteModalRef" hide-footer title="Confirmation">
      <div class="d-block text-center">
        <h3>Do you confirm deletion ?</h3>
      </div>
      <button class="btn btn-secondary" @click="handleModalConfirmYes()">Yes</button>
      <button class="btn btn-secondary" @click="handleModalConfirmNo()">No</button>
    </b-modal>
  </div>
</template>

<script>

export default {
  idToDelete: '',
  name: 'ChartList',
  data () {
    return {
      deleteChartError: '',
      listError: '',
      addChartFormSubmitError: '',
      fillFieldSelectsError: '',
      list: [],
      moduleSelectOptions: [],
      moduleFieldsSelectOptions: [],
      addChartFormData: {
        name: '',
        description: '',
        type: '',
        moduleID: null,
        x: null,
        xmax: '',
        xmin: '',
        y: null,
        groupby: null,
        sum: null,
        count: null,
      },
    }
  },
  async created () {
    this.$_initList()
    this.$_initModulesSelect()
  },
  methods: {
    async $_initList () {
      try {
        this.listError = ''
        this.list = await this.$crm.chartList({})
        this.list.forEach(chart => {
          chart.links = {
            read: `/crm/charts/${chart.id}`,
            edit: `/crm/charts/${chart.id}/edit`,
          }
        })
      } catch (e) {
        this.listError = 'Error when trying to get list of charts = ' + e.message
      }
    },
    async $_initModulesSelect () {
      try {
        this.moduleSelectError = ''
        this.moduleSelectOptions = await this.$crm.moduleList({})
      } catch (e) {
        this.moduleSelectError = 'Error getting modules = ' + e.message
      }
    },
    async fillFieldSelects (moduleId) {
      this.fillFieldSelectsError = ''
      try {
        this.fillFieldSelectsError = ''

        // We need to deselect the selected value. Somehow, it doesn't happen...
        /* this.$refs["selectX"].selectedIndex = -1
        this.$refs["selectXMin"].value = ''
        this.$refs["selectXMax"].value = ''
        this.$refs["selectY"].selectedIndex = -1
        this.$refs["selectCount"].selectedIndex = -1
        this.$refs["selectGroupBy"].selectedIndex = -1
        this.$refs["selectSum"].selectedIndex = -1 */

        this.moduleFieldsSelectOptions = await this.$crm.moduleRead({ moduleID: moduleId })
      } catch (e) {
        this.fillFieldSelectsError = 'Error loading fields for this module = ' + e.message
      }
    },
    async handleAddChartFormSubmit () {
      this.addChartFormSubmitError = ''
      try {
        await this.$crm.chartCreate(this.addChartFormData)
        await this.$_initList()
      } catch (e) {
        this.addChartFormSubmitError = 'Error when trying to create chart = ' + e.message
      }
    },
    async handleDeleteChart (id) {
      this.idToDelete = id
      this.$refs.myDeleteModalRef.show(id)
    },
    async handleModalConfirmYes () {
      try {
        await this.$crm.chartDelete({ id: this.idToDelete })
        await this.$_initList()
      } catch (e) {
        this.deleteChartError = 'Error when trying to delete chart = ' + e.message
      }
      this.$refs.myDeleteModalRef.hide()
    },
    handleModalConfirmNo () {
      this.$refs.myDeleteModalRef.hide()
    },
  },
}
</script>

<style lang="scss" scoped>
.action {
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 3px;
}
</style>
