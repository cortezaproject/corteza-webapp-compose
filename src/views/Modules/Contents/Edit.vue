<template>
  <section class="container" id="modules-contents-edit">
    <h1 v-if="mode === 'create'">{{module.name}}: create entry</h1>
    <h1 v-if="mode === 'edit'">{{module.name}}: edit entry</h1>

    <table class="table table-striped">
      <tbody>
        <template v-for="field in module.fields">
          <tr :key="'modules-contents-edit-fields-' + field.name">
            <td><b>{{field.title}}</b></td>
            <td v-if="getField(field.kind) in $options.components" :key="'modules-contents-edit-' + field.id">
              <component :is="getField(field.kind)" :field="field" :row="row.fields"></component>
            </td>
            <td v-else>
              <FieldEdit :field="field"></FieldEdit>
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

import FieldTextEdit from '@/components/Field/TextEdit.vue'

export default {
  components: {
    FieldEdit,
    FieldTextEdit,
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
    this.loadModule()
    this.loadContent()
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
