<template>
  <section class="container" id="modules-contents-edit">
    <h1 v-if="mode === 'create'">{{module.name}}: create entry</h1>
    <h1 v-if="mode === 'edit'">{{module.name}}: edit entry</h1>

    <table class="table table-striped">
      <tbody>
        <template v-for="field in module.fields">
          <tr :key="'modules-contents-edit-fields-' + field.name">
            <td><b>{{field.title}}</b></td>
            <td>
              <FieldEdit :field="field" :row="row"></FieldEdit>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <a href="#" @click="save" class="btn btn-primary">Save entry</a>
    &nbsp; <a :href="links.cancel" class="btn btn-secondary">Cancel</a>

    <pre>{{ $data }}</pre>

  </section>
</template>

<script>
import FieldEdit from '@/components/FieldEdit.vue'

export default {
  components: {
    FieldEdit,
  },
  data () {
    var mode = ('contentID' in this.$route.params) ? 'edit' : 'create'
    var moduleID = this.$route.params.moduleID
    return Object.assign({
      row: {
        fields: {},
      },
      module: {},
      mode: mode,
      links: {
        create: `/crm/modules/${moduleID}/content/edit`,
        cancel: `/crm/modules/${moduleID}`,
      },
      errors: [],
    }, this.$route.params)
  },
  async created () {
    await this.loadModule()
    await this.loadContent()
  },
  methods: {
    getField (type) {
      return 'Field' + type.charAt(0).toUpperCase() + type.substring(1) + 'Edit'
    },
    async loadModule () {
      try {
        this.errors.splice(0)
        var req = {
          moduleID: this.moduleID,
        }
        this.module = await this.$crm.moduleRead(req)
      } catch (e) {
        this.errors = [e.message]
        throw e
      }
    },
    async loadContent () {
      if (this.mode !== 'edit') {
        return
      }
      try {
        this.errors.splice(0)
        var req = {
          moduleID: this.moduleID,
          contentID: this.contentID,
        }
        this.row = await this.$crm.moduleContentRead(req)
        var fields = {}
        this.row.fields.forEach(({ name, value }) => {
          fields[name] = value
        })
        this.module.fields.forEach(({ name }) => {
          if (!(name in fields)) {
            // @todo: default value
            fields[name] = ''
          }
        })
        this.row.fields = fields
      } catch (e) {
        this.errors = [e.message]
        throw e
      }
    },
    async save () {
      var formatFields = (row) => {
        var fields = []
        for (var name in row) {
          var value = row[name]
          fields.push({ name, value })
        }
        return fields
      }
      var req = {
        moduleID: this.moduleID,
        fields: formatFields(this.row.fields),
      }
      try {
        if (this.mode === 'create') {
          await this.$crm.moduleContentCreate(req)
        } else {
          req.contentID = this.contentID
          await this.$crm.moduleContentEdit(req)
        }
        this.$router.push({
          path: this.links.cancel,
        })
      } catch (e) {
        this.errors = [e.message]
      }
    },
  },
}
</script>
