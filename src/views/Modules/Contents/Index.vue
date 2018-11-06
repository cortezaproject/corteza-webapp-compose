<template>
  <section class="container" id="modules-contents-index">
    <h1>List module content rows</h1>

    <table class="table table-striped">
      <tbody>
        <tr v-for="row in rows" :key="'modules-contents-index-' + row.id">
          <td>{{row}}</td>
        </tr>
      </tbody>
    </table>

    <template v-if="rows.length === 0">
      <p>No content rows added yet.</p>
    </template>

    <a :href="links.create" class="btn btn-primary">Add new entry</a>
    &nbsp; <a :href="links.edit" class="btn btn-secondary">Edit module</a>
    &nbsp; <a :href="links.back" class="btn btn-warning">Back to Module list</a>
  </section>
</template>

<script>
export default {
  data () {
    var moduleID = this.$route.params.moduleID
    return {
      moduleID: moduleID,
      links: {
        create: `/crm/modules/${moduleID}/content/edit`,
        edit: `/crm/modules/${moduleID}/edit`,
        back: `/crm/modules/`,
      },
      page: 0,
      perPage: 20,
      rows: [],
      errors: [],
    }
  },
  async created () {
    this.loadPage()
  },
  methods: {
    async loadPage () {
      try {
        var req = {
          page: this.page,
          perPage: this.perPage,
          moduleID: this.moduleID,
        }
        this.rows = await this.$crm.moduleContentList(req)
      } catch (e) {
        this.errors = [e.message]
        throw e
      }
    },
  },
}
</script>
