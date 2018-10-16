<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Edit page</h2>
          <form @submit.prevent="handleEditPageFormSubmit">
            <input required type="hidden" v-model="editPageFormData.id" id="id" />
            <div class="form-group">
              <label for="title">Page title</label>
              <input required type="text" v-model="editPageFormData.title" class="form-control" id="title" placeholder="Page title" />
            </div>
            <div class="form-group">
              <label for="module">Module</label>
              <select v-model="editPageFormData.moduleID" class="form-control" id="module">
                <option v-for="module in modules" :key="module.id" :value="module.id">{{ module.name }}</option>
              </select>
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
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PageEdit',
  created () {
    this.$store.dispatch('pages/initEditPageFormData', this.$route.params.id)
    this.$store.dispatch('modules/initList', this.$route.params.id)
  },
  computed: {
    ...mapState({
      initEditPageError: state => state.pages.initEditPageError,
      editPageFormSubmitError: state => state.pages.editPageFormSubmitError,
      modules: state => state.modules.list,
    }),
    editPageFormData: {
      get () {
        return this.$store.state.pages.editPageFormData
      },
      set (newValue) {
        this.$store.commit('pages/setEditPageFormData', newValue)
      },
    },
  },
  methods: {
    ...mapActions('pages', []),
    async handleEditPageFormSubmit () {
      await this.$store.dispatch('pages/handleEditPageFormSubmit')
      this.$router.push({ path: '/crm/pages' })
    },
  },
}
</script>
<style lang="scss" scoped>
@import "~bootstrap/scss/bootstrap";
</style>
