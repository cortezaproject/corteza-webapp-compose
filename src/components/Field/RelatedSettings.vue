<template>
  <div class="row no-gutters">
    <div class="form-group" style="padding-right: 2em;">
      <label class="d-block">Module name</label>
      <select name="field.name + '_settings[module]'" v-model="settings.module" @change="settings.field = ''" autocomplete="off">
        <option value="">Pick module</option>
        <option v-for="module in modules" :value="module.id" :key="'field-related-settings-' + module.name">{{module.name}}</option>
      </select>
    </div>

    <div class="form-group" v-if="settings.module != ''">
      <label class="d-block">Field name</label>
      <select name="field.name + '_settings[field]'" v-model="settings.field" autocomplete="off">
        <option value="">Pick field</option>
        <option v-for="field in selectedModule.fields" :value="field.name" :key="'field-related-settings-' + settings.module + '-' + field.name">{{field.title}}</option>
      </select>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    'field': Object,
  },
  name: 'Module-Field-Related',
  data () {
    return {
      modules: [],
      settings: {
        module: '',
        field: '',
      },
    }
  },
  computed: {
    selectedModule: function () {
      for (let k in this.modules) {
        let module = this.modules[k]
        if (module.id === this.settings.module) {
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
        // this.settings.module = response[0].id
      })
      .catch(e => {
        this.error = e
      })
  },
}
</script>
