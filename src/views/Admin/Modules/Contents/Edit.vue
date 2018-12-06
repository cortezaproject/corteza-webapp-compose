<template>
  <section class="container well" id="modules-contents-edit">
    <h2 v-if="mode === 'create'">{{module.name}}: create entry</h2>
    <h2 v-if="mode === 'edit'">{{module.name}}: edit entry</h2>

    <table class="table">
      <tbody>
        <template v-for="field in module.fields">
          <tr :key="'modules-contents-edit-fields-' + field.name">
            <td><label>{{field.title}}</label></td>
            <td>
              <FieldEdit :field="field" :row="row"></FieldEdit>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <button @click="save" class="btn btn-dark large">Save entry</button>
    <router-link :to="{ name: 'admin.modules.content', params: { moduleID }}" class="btn large">Cancel</router-link>
  </section>
</template>

<script>
import FieldEdit from '@/components/FieldEdit.vue'

export default {
  props: {
    moduleID: String,
    contentID: String,
  },
  components: {
    FieldEdit,
  },
  data () {
    return {
      row: {
        fields: {},
      },
      module: {},
      mode: this.contentID ? 'edit' : 'create',
      errors: [],
    }
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
        this.$router.push({ name: 'admin.modules.content', params: { moduleID: this.moduleID } })
      } catch (e) {
        this.errors = [e.message]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

table {
  td {
    vertical-align: middle;
  }
}
</style>
