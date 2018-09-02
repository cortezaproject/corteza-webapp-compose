<template>
	<div class="container" v-if="loaded >= 1">
	<h1 v-if="'name' in params">{{ _('Editing module fields') }}</h1>
	<h1 v-else>{{ _('Creating new module') }}</h1>

	<template v-if="error">
		<p>An error occured: {{error}}</p>
	</template>

	<p>{{ _('A module is created from any number of fields. You can add as many fields as you wish below.') }}</p>

	<table class="table" border="1">
		<thead>
			<tr>
				<th>#</th>
				<th>Name <a class="btn btn-info" v-tooltip="_('Must be lower-case a-z, 0-9 and underscore')"></a></th>
				<th>Title <a class="btn btn-info" v-tooltip="_('The name displayed in form input / data lists')"></a></th>
				<th>Type</th>
				<th>GDPR</th>
				<th>Show in list</th>
			</tr>
		</thead>
		<draggable v-model="module.fields" :options="{handle:'.handle'}" :element="'tbody'">
			<tr v-for="field in module.fields" :key="field.id">
				<td class="handle">[{{field.id}}]</td>
				<td><input v-model="field.name" type="text"/></td>
				<td><input v-model="field.title" type="text"/></td>
				<td><select v-model="field.type">
				<option v-for="fieldType in fields" :value="fieldType.field_type">{{ _(fieldType.field_name) }}</option>
				</select></td>
				<td>
					<input v-model="field.gdpr" type="checkbox"> Sensitive data
				</td>
				<td>
					<input v-model="field.show" type="checkbox"> Show
				</td>
			</tr>
		</draggable>
	</table>

	<p>
		<button @click="addField()">Add new field</button>
	</p>

	<p>Modules Edit, params={{params}}</p>
</div>
</template>

<script>
import client from '@/store/client'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  data () {
    return {
      loaded: 0,
      fields: [],
      fieldSeq: 0,
      module: {
        fields: []
      },
      params: {}
    }
  },
  created () {
    this.params = this.$route.params
    this.listFields()
    this.addField()
    this.loaded = true
  },
  methods: {
    addField: function () {
      this.module.fields.push({
        id: this.newID(),
        name: '',
        title: '',
        type: 'text',
        gdpr: false,
      })
    },
    newID: function () {
      this.fieldSeq ++
      return this.fieldSeq
    },
    listFields: function () {
      var fieldListError = (error) => {
        this.error = error
      }
      var fieldList = (response) => {
        if ('error' in response.data) {
          fieldListError(response.data.error.message)
          return
        }
        if (Array.isArray(response.data.response)) {
          this.fields.splice(0)
          response.data.response.forEach((field) => {
            field.id = this.newID()
            this.fields.push(field)
          })
          return
        }
        fieldListError("Unexpected response when fetching field list")
      }
      var fieldListFinalizer = () => {
        this.loaded ++
      }

      client.fieldList()
        .then(fieldList)
        .catch(fieldListError)
        .finally(fieldListFinalizer)
    }
  }
}
</script>
