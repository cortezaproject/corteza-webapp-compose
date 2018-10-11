<template>
  <div class="container" v-if="loaded >= 1">
  <h1 v-if="'id' in params">{{ _('Editing module fields') }}</h1>
  <h1 v-else>{{ _('Creating new module') }}</h1>

  <template v-if="error">
    <p>An error occured: {{error}}</p>
  </template>

  <p>{{ _('A module is created from any number of fields. You can add as many fields as you wish below.') }}</p>

  <label>Name for the module</label>
  <input v-model="module.name" type="text"/>

  <table class="table" border="1">
    <thead>
      <tr>
        <th>#</th>
        <th>Name <a class="btn btn-info" v-tooltip="_('Must be lower-case a-z, 0-9 and underscore')"></a></th>
        <th>Title <a class="btn btn-info" v-tooltip="_('The name displayed in form input / data lists')"></a></th>
        <th>Kind</th>
        <th>GDPR</th>
        <th>Show in list</th>
      </tr>
    </thead>
    <draggable v-model="module.fields" :options="{handle:'.handle'}" :element="'tbody'">
      <tr v-for="field in module.fields" :key="field.id">
        <td class="handle">[{{field.id}}]</td>
        <td><input v-model="field.name" type="text"/></td>
        <td><input v-model="field.title" type="text"/></td>
        <td><select v-model="field.kind">
        <option v-for="fieldType in fields" :key="fieldType.field_type" :value="fieldType.field_type">{{ _(fieldType.field_name) }}</option>
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
    <button @click="save">Save</button>
  </p>

  <p>Modules Edit, params={{params}}</p>
</div>
</template>

<script>
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
        name: '',
        fields: [],
      },
      params: {},
    }
  },
  created () {
    this.params = this.$route.params
    this.listFields()
    if (this.params.id) {
      this.read(this.params.id)
    } else {
      this.addField()
      this.loaded = true
    }
  },
  methods: {
    addField: function () {
      this.module.fields.push({
        id: this.newID(),
        name: '',
        title: '',
        kind: 'text',
        gdpr: false,
      })
    },
    newID: function () {
      this.fieldSeq++
      return this.fieldSeq
    },
    listFields: function () {
      this.clearError()

      // response handler
      var response = response => {
        if (Array.isArray(response.data.response)) {
          this.fields.splice(0)
          response.data.response.forEach(field => {
            this.fields.push(field)
          })
          return
        }
        this.showError('Unexpected response when fetching field list')
      }

      this.$crm
        .fieldList()
        .then(response)
        .catch(e => this.showError(e.message))
        .finally(() => {
          this.loaded++
        })
    },
    read: function (id) {
      this.clearError()

      // response handler
      var response = resp => {
        this.loaded = true
        if (typeof resp.data.response === 'object') {
          this.module = resp.data.response
          return
        }
        this.showError('Unexpected response when reading module')
      }

      this.$crm
        .moduleRead(id)
        .then(response)
        .catch(e => this.showError(e.message))
        .finally(() => {
          this.loaded++
        })
    },
    save: function () {
      this.clearError()

      // response handler
      var response = resp => {
        if (Array.isArray(resp.data.response)) {
          this.fields.splice(0)
          resp.data.response.forEach(field => {
            field.id = this.newID()
            this.fields.push(field)
          })
          return
        }
        this.showError('Unexpected response when saving module')
      }

      var request = () => {
        if ('id' in this.params) {
          return this.$crm.moduleEdit(this.params.id, this.module.name, this.module.fields)
        }
        return this.$crm.moduleCreate(this.module.name, this.module.fields)
      }

      request()
        .then(response)
        .catch(e => this.showError(e.message))
        .finally(() => {
          this.loaded++
        })
    },
  },
}
</script>
