<template>
  <div class="row no-gutters">
    <div class="form-group" style="padding-right: 2em;">
      <label class="d-block">Module name</label>
      <select name="field.name + '_options[module]'" v-model="options.module" @change="options.field = ''" autocomplete="off" class="form-control">
        <option value="">Pick module</option>
        <option v-for="module in modules" :value="module.id" :key="'field-related-options-' + module.name">{{module.name}}</option>
      </select>
    </div>

    <div class="form-group" v-if="options.module != ''">
      <label class="d-block">Field name</label>
      <select name="field.name + '_options[field]'" v-model="options.field" autocomplete="off" class="form-control">
        <option value="">Pick field</option>
        <option v-for="field in selectedModule.fields" :value="field.name" :key="'field-related-options-' + options.module + '-' + field.name">{{field.title}}</option>
      </select>
    </div>

  </div>
</template>

<script>
import optionsSyncProp from './mixins/optionsSyncProp'

export default {
  props: {
    'field': Object,
  },

  data () {
    return {
      modules: [],
      options: {
        module: '',
        field: '',
      },
    }
  },

  computed: {
    selectedModule: function () {
      for (let k in this.modules) {
        let module = this.modules[k]
        if (module.id === this.options.module) {
          return module
        }
      }
      return {
        fields: [],
      }
    },
  },

  created () {
    this.$crm.moduleList({ query: '' })
      .then((response) => {
        this.modules = response
        // this.options.module = response[0].id
      })
      .catch(e => {
        this.error = e
      })
  },

  mixins: [
    optionsSyncProp,
  ],
}
</script>
