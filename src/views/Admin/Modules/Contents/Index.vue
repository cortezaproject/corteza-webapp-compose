<template>
  <section class="container" id="modules-contents-index">
    <h1>{{module.name}}</h1>
    <table class="table table-striped">
      <thead>
        <tr>
          <th v-for="moduleField in module.fields" :key="'modules-contents-title-' + moduleField.name" v-if="moduleField.isVisible">
            {{moduleField.title}}
          </th>
          <th class="text-right">Actions</th>
        </tr>
        <tr v-if="debug">
          <td :colspan="module.colspan">
            <pre>{{module}}</pre>
          </td>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in list.contents">
          <tr :key="'modules-contents-index-' + row.id">
            <td v-for="moduleField in module.fields" :key="'modules-contents-' + row.id + '-' + moduleField.name" v-if="moduleField.isVisible">
              <span v-if="moduleField.name in row.fields">{{row.fields[moduleField.name]}}</span>
              <span v-else><i>None</i></span>
            </td>
            <td class="text-right">
              <router-link :to="{name: 'admin.modules.content.edit', params: { moduleID, contentID: row.contentID }}" class="btn btn-sm btn-primary">Edit</router-link>
              &nbsp; <a @click="deleteContent(row.id)" class="btn btn-sm btn-warning">Delete</a>
            </td>
          </tr>
          <tr v-if="debug" :key="'modules-contents-index-' + row.id + '-debug'">
            <td :colspan="module.colspan"><pre>{{row}}</pre></td>
          </tr>
        </template>
      </tbody>
    </table>

    <template v-if="list.contents.length === 0">
      <p>No content rows added yet.</p>
    </template>

    <router-link :to="{name: 'admin.modules.content.add', params: { moduleID }}" class="btn btn-primary">Add new entry</router-link>
    &nbsp;
    <router-link :to="{name: 'admin.modules.edit', params: { moduleID }}" class="btn btn-secondary">Edit module</router-link>
    &nbsp;
    <router-link :to="{name: 'admin.modules'}" class="btn btn-warning">Back to Module list</router-link>
  </section>
</template>

<script>
export default {
  props: {
    moduleID: String,
  },
  data () {
    return {
      debug: false,
      module: {},
      page: 0,
      perPage: 20,
      list: {
        contents: [],
      },
      errors: [],
    }
  },
  async created () {
    this.loadModule()
    this.loadPage()
  },
  methods: {
    async deleteContent (contentID) {
      try {
        var req = {
          moduleID: this.moduleID,
          contentID: contentID,
        }
        await this.$crm.moduleContentDelete(req)
        this.loadPage()
      } catch (e) {
        this.errors = [e.message]
        throw e
      }
    },
    async loadModule () {
      try {
        this.errors.splice(0)
        var req = {
          moduleID: this.moduleID,
        }
        this.module = await this.$crm.moduleRead(req)
        this.module.colspan = 1
        this.module.fields.forEach(field => {
          if (field.isVisible) {
            this.module.colspan++
          }
        })
      } catch (e) {
        this.errors = [e.message]
        throw e
      }
    },
    async loadPage () {
      try {
        var req = {
          page: this.page,
          perPage: this.perPage,
          moduleID: this.moduleID,
          query: '',
        }
        this.list = await this.$crm.moduleContentList(req)
        this.list.contents.forEach(contents => {
          var fields = {}
          contents.fields.forEach(({ name, value }) => {
            fields[name] = value
          })
          contents.fields = fields
          contents.links = {
            edit: `/crm/modules/${this.moduleID}/content/${contents.id}/edit`,
          }
        })
      } catch (e) {
        this.errors = [e.message]
        throw e
      }
    },
  },
}
</script>
