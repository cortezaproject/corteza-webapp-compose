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
import { mapState } from 'vuex'
export default {
  name: 'PageEdit',
  data () {
    return {
      editPageError: '',
      editPageFormSubmitError: '',

    }
  },
  async created () {
    try {
      this.editPageError = ''
      await Promise.all([
        this.$store.dispatch('pages/initEditPageFormData', this.$route.params.id),
        this.$store.dispatch('modules/initList', this.$route.params.id),
      ])
    } catch (e) {
      this.editPageError = 'Error when trying to init page form.'
    }
  },
  computed: {
    ...mapState('modules', {
      'modulesList': 'list',
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
    async handleEditPageFormSubmit () {
      try {
        this.editPageFormSubmitError = ''
        await this.$store.dispatch('pages/handleEditPageFormSubmit')
        this.$router.push({ path: '/crm/pages' })
      } catch (e) {
        this.editPageFormSubmitError = 'Error when trying to edit page.'
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import "~bootstrap/scss/bootstrap";
.container /deep/ {
  // Bootstrap Modal doesnt work if we comment this line
  @import "~bootstrap/scss/bootstrap";
}
</style>
