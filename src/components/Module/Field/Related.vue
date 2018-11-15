<template>
  <div class="row no-gutters">
    Related field extra options

    Error: {{ error }}
    Modules: {{ modules }}

    {{ field }}
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
    }
  },
  created () {
    this.$crm.moduleList({ query: '' })
      .then((response) => {
        this.modules = response
      })
      .catch(e => {
        this.error = e
      })
  },
}
</script>
