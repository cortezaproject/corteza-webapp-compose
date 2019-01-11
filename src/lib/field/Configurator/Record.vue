<template>
  <div>
    <div class="form-group">
      <label class="d-block">Module name</label>
      <b-form-select v-model="f.options.moduleID"
                     :options="modules"
                     text-field="name"
                     value-field="moduleID"
                     class="form-control">
        <template slot="first"><option disabled>Pick module</option></template>
      </b-form-select>
    </div>

    <div class="form-group">
      <label class="d-block">Record label from field</label>
      <b-form-select v-model="f.options.labelField"
                     class="form-control"
                     :options="fields"
                     :disabled="!module">
        <template slot="first"><option disabled>Pick field</option></template>
      </b-form-select>
    </div>
    <div class="form-group">
      <label class="d-block">Query fields on search</label>
      <b-form-select v-model="f.options.queryFields"
                     class="form-control"
                     :options="fields"
                     multiple
                     :disabled="!module">
      </b-form-select>
    </div>
  </div>
</template>

<script>
import base from './base'
import { Record } from '@/lib/field/Record'
import Module from '@/lib/module'

// @todo rename to Record and make appropriate changes...
export default {
  extends: base,

  data () {
    return {
      modules: [],
      selected: null,
    }
  },

  computed: {
    module () {
      return this.modules.find(m => m.moduleID === this.f.options.moduleID)
    },

    fields () {
      return this.module ? this.module.fields.map(f => { return { value: f.name, text: f.label || f.name } }) : []
    },
  },

  created () {
    this.f.options = new Record(this.f.options)

    this.$crm.moduleList({}).then((mm) => {
      this.modules = mm.map(m => new Module(m))
    }).catch(this.defaultErrorHandler('Could not load module list'))
  },
}
</script>
