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
            <button type="submit" class="btn btn-default">Edit</button>
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
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Page',
  created () {
    this.$store.dispatch('pages/initEditPageFormData', this.$route.params.id)
  },
  computed: {
    ...mapState({
      initEditPageError: state => state.pages.initEditPageError,
      editPageFormSubmitError: state => state.pages.editPageFormSubmitError,
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
