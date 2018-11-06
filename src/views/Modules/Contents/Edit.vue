<template>
  <section class="container" id="modules-contents-edit">
    <h1 v-if="mode === 'create'">{{module.name}}: create entry</h1>
    <h1 v-if="mode === 'edit'">{{module.name}}: edit entry</h1>

    <table class="table table-striped">
      <tbody>
        <template v-for="field in module.fields">
          <tr :key="'modules-contents-edit-' + field.name">
            <td><b>{{field.title}}</b></td>
            <td>
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

export default {
  components: {
    FieldEdit,
  },
  data () {
    var mode = ('contentID' in this.$route.params) ? 'edit' : 'create'
    var moduleID = this.$route.params.moduleID
    return Object.assign({
      row: {},
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
      } catch (e) {
        this.errors = [e.message]
        throw e
      }
    },
    async save () {
      var req = {
        moduleID: this.moduleID,
        fields: this.row,
      }
      // @todo: try/catch etc.
      if (this.mode === 'create') {
        await this.$crm.moduleContentCreate(req)
      } else {
        req.contentID = this.contentID
        await this.$crm.moduleContentEdit(req)
      }
      console.log('TODO')
    },
  },
}
</script>
