<template>
  <div>
    <div class="editor">
      <a href="/crm/admin/pages" class="btn-url">&#171; Back to pages list</a>
      <confirmation-toggle @confirmed="handleDeletePage" class="confirmation">Delete page</confirmation-toggle>
      <router-link :to="{name: 'admin.pages'}" class="btn">Cancel</router-link>
      <button type="submit" @click.prevent="handleSave()" class="btn btn-blue">Save</button>
      <button type="button" @click.prevent="handleSave({ closeOnSuccess: true })" class="btn btn-blue">Save and close</button>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well">
            <h2>Edit page</h2>
            <router-link :to="{name: 'admin.pages.builder'}" class="btn-url float-right">Page builder</router-link>
            <form @submit.prevent="handleSave()">
              <input required type="hidden" v-model="page.pageID" id="id" />
              <div class="form-group">
                <label for="title">Page title</label>
                <input required type="text" v-model="page.title" class="form-control" id="title" placeholder="Page title" />
              </div>
              <div class="form-group">
                <label for="title">Description</label>
                <textarea v-model="page.description" class="form-control" id="description" placeholder="Page description" />
              </div>
              <div class="form-group form-check">
                <input type="checkbox" id="visible" class="form-check-input" v-model="page.visible">
                <label for="visible" class="form-check-label">Page visible?</label>
              </div>
            </form>
          </div>
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
      modulesList: [],
      page: {},
    }
  },

  created () {
    this.$crm.pageRead({ pageID: this.pageID }).then((page) => {
      if (page.moduleID !== '0') {
        // Do not allow to edit record pages, move to builder
        this.$router.replace({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
      }

      this.page = page
    }).catch(this.defaultErrorHandler('Could not load page'))
  },
  methods: {
    handleSave ({ closeOnSuccess = false } = {}) {
      this.$crm.pageEdit(this.page).then(() => {
        this.raiseSuccessAlert('Page saved')
        if (closeOnSuccess) {
          this.$router.push({ name: 'admin.pages' })
        }
      }).catch(this.defaultErrorHandler('Could not save this page'))
    },

    handleDeletePage () {
      this.$crm.pageDelete({ pageID: this.pageID }).then(() => {
        this.$router.push({ name: 'admin.pages' })
      }).catch(this.defaultErrorHandler('Could not delete this page'))
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

h2 {
  display: inline-block;
}

.form-check {
  display: inline-block;

  &-label {
    line-height: 24px;
    margin-left: 5px;
  }
}

.confirmation {
  margin-right: 0.5em;
}
</style>
