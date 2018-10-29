<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Edit page</h2>
          <div v-if="editPageError" style="color:red">
            {{ editPageError }}
          </div>
          <form v-if="!editPageError" @submit.prevent="handleEditPageFormSubmit">
            <input required type="hidden" v-model="editPageFormData.id" id="id" />
            <div class="form-group">
              <label for="title">Page title</label>
              <input required type="text" v-model="editPageFormData.title" class="form-control" id="title" placeholder="Page title" />
            </div>
            <div class="form-group">
              <label for="selfID">Parent page </label>
              <select v-model="editPageFormData.selfID" class="form-control" id="selfID">
                <option :value="null"></option>
                <option v-for="page in pageList" :key="page.id" :value="page.id">{{ page.title }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="order">Order (API update neded)</label>
              <input required type="number" v-model="editPageFormData.order" class="form-control" id="order" placeholder="Order" />
            </div>
            <div class="form-group">
              <label for="title">Description</label>
              <textarea v-model="editPageFormData.description" class="form-control" id="description" placeholder="Page description" />
            </div>
            <div class="form-group form-check">
              <input type="checkbox" id="visible" class="form-check-input" v-model="editPageFormData.visible">
                <label for="visible" class="form-check-label">Visible ?</label>
              </div>
              <div class="form-group">
                <label for="module">Module</label>
                <select v-model="editPageFormData.moduleID" class="form-control" id="module">
                  <option :value="null"></option>
                  <option v-for="module in modulesList" :key="module.id" :value="module.id">{{ module.name }}</option>
                </select>
                <router-link :to="'/crm/modules'" class="actions__action">Add a module</router-link>
              </div>
              <button type="submit" class="btn btn-primary">Save</button>
              <div v-if="editPageFormSubmitError" style="color:red">
                {{ editPageFormSubmitError }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'PageEdit',
  data () {
    return {
      editPageError: '',
      editPageFormSubmitError: '',
      modulesList: [],
      editPageFormData: {
        title: '',
        moduleID: '',
      },
      pageList: [],
    }
  },
  async created () {
    try {
      this.editPageError = ''
      this.editPageFormData = await this.$crm.pageRead({ id: this.$route.params.id })
      // Parent pages : not itself
      this.pageList = (await this.$crm.pageList({})).filter((page) => page.id !== this.$route.params.id)
      this.modulesList = await this.$crm.moduleList({})
    } catch (e) {
      this.editPageError = 'Error when trying to init page form.'
    }
  },
  methods: {
    async handleEditPageFormSubmit () {
      try {
        this.editPageFormSubmitError = ''
        await this.$crm.pageEdit(this.editPageFormData)
        this.$router.push({ path: '/crm/pages' })
      } catch (e) {
        this.editPageFormSubmitError = 'Error when trying to edit page.'
      }
    },
  },
}
</script>
