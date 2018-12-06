<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well">
          <h2>Edit page</h2>
          <router-link :to="{name: 'admin.pages.builder'}" class="btn-url">Page builder</router-link>
          <div v-if="editPageError" style="color:red;">
            {{ editPageError }}
          </div>
          <div v-if="editPageFormSubmitError" style="color:red;">
            {{ editPageFormSubmitError }}
          </div>
          <form v-if="!editPageError" @submit.prevent="handleEditPageFormSubmit">
            <input required type="hidden" v-model="editPageFormData.pageID" id="id" />
            <div class="form-group">
              <label for="title">Page title</label>
              <input required type="text" v-model="editPageFormData.title" class="form-control" id="title" placeholder="Page title" />
            </div>
            <div class="form-group">
              <label for="title">Description</label>
              <textarea v-model="editPageFormData.description" class="form-control" id="description" placeholder="Page description" />
            </div>
            <div class="form-group form-check">
              <input type="checkbox" id="visible" class="form-check-input" v-model="editPageFormData.visible">
              <label for="visible" class="form-check-label">Page visible?</label>
            </div>

            <div>
              <router-link :to="{name: 'admin.pages'}" class="btn">Cancel</router-link>
              <confirmation-toggle @confirmed="handleDeletePage" class="confirmation">Delete</confirmation-toggle>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'

export default {
  name: 'PageEdit',
  props: {
    pageID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      editPageError: '',
      editPageFormSubmitError: '',
      modulesList: [],
      editPageFormData: {},
    }
  },
  async created () {
    try {
      this.editPageError = ''
      this.editPageFormData = await this.$crm.pageRead({ pageID: this.pageID })

      if (this.editPageFormData.moduleID !== '0') {
        // Do not allow to edit record pages, move to builder
        this.$router.push({ name: 'admin.pages.builder', params: { pageID: this.editPageFormData.pageID } })
      }
    } catch (e) {
      this.editPageError = 'Error when trying to init page form.'
    }
  },
  methods: {
    async handleEditPageFormSubmit () {
      try {
        this.editPageFormSubmitError = ''
        await this.$crm.pageEdit(this.editPageFormData)
      } catch (e) {
        this.editPageFormSubmitError = 'Error when trying to edit page.'
      }
    },

    handleDeletePage () {
      this.$crm.pageDelete({ pageID: this.pageID }).then(() => {
        this.$router.push({ name: 'admin.pages' })
      })
    },
  },

  components: {
    ConfirmationToggle,
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

textarea {
  &.form-control {
    min-height: 200px;
  }
}

.confirmation {
  float: right;
}
</style>
