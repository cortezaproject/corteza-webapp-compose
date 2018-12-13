<template>
  <div>
    <label class="d-block">Module name</label>
    <select v-model="f.options.moduleID" class="form-control">
      <option value="">Pick module</option>
      <option v-for="module in modules" :value="module.moduleID" :key="module.moduleID">{{module.name}}</option>
    </select>
    {{ field }}
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
    }
  },

  created () {
    this.f.options = new Record(this.f.options)

    this.$crm.moduleList({}).then((mm) => {
      this.modules = mm.map(m => new Module(m))
    }).catch(this.defaultErrorHandler('Could not load module list'))
  },
}
</script>
