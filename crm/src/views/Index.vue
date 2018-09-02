<template>
	<div class="container" v-if="loaded">
		<template v-if="modules.length == 0">
			<p>You haven't created any modules so far.</p>
			<a class="btn btn-primary" href="/modules/edit">Create new module</a>
		</template>
		<ul v-else>
			<li v-for="module in modules">
				<a :href="module.link">{{module.title}}</a>
			</li>
		</ul>
	</div>
</template>

<script>
import client from '@/store/client'

export default {
  data () {
    return {
      'loaded': true,
      'modules': [],
      'result': {},
    }
  },

  created () {

    var moduleListError = (error) => {
      this.result.error = error
    }
    var moduleList = (response) => {
      if ('error' in response.data) {
        moduleListError(response.data.error.message)
        return
      }
      if (Array.isArray(response.data.response)) {
        this.modules.splice(0)
        response.data.response.forEach((module) => {
          module.link = '/modules/' + module.Id
          this.modules.push(module)
        })
        return
      }
      moduleListError("Unexpected response when fetching module list")
    }
    var moduleListFinalizer = () => {
      this.loaded = true
    }

    client.moduleList()
      .then(moduleList)
      .catch(moduleListError)
      .finally(moduleListFinalizer)
  },
}
</script>
