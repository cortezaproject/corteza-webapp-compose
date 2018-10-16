<template>
  <div class="container" v-if="loaded">
    <template v-if="error">
      <p>An error occured: {{error}}</p>
    </template>
    <template v-if="modules.length == 0">
      <p>No modules have been created yet.</p>
      <p><a class="btn btn-primary" href="/crm/modules/edit">Create new module</a></p>
    </template>
    <ul v-else>
      <li v-for="module in modules" :key="module.id">
        <a :href="module.links.read">{{module.name}}</a> [<a :href="module.links.edit">edit</a>]
      </li>
    </ul>
    <p><a href="/crm/pages">Pages</a></p>
    <p><a href="/crm/modules">Modules</a></p>
    <p><a href="/crm/auth/signin">Sign In</a></p>
    <p><a href="/crm/auth/signout">Sign Out</a></p>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
export default {
  data () {
    return {
      loaded: true,
      modules: [],
      result: {},
    }
  },
  created () {
    this.moduleList()
  },
  methods: {
    moduleList () {
      this.clearError()
      var moduleList = response => {
        if (Array.isArray(response)) {
          this.modules.splice(0)
          response.forEach(module => {
            module.links = {
              read: '/crm/modules/' + module.id,
              edit: '/crm/modules/' + module.id + '/edit',
            }
            this.modules.push(module)
          })
          return
        }
        this.showError('Unexpected response when fetching module list')
      }
      var moduleListFinalizer = () => {
        this.loaded = true
      }
      this.$crm
        .moduleList()
        .then(moduleList)
        .catch(e => this.showError(e.message))
        .finally(moduleListFinalizer)
    },
  },
}
</script>
