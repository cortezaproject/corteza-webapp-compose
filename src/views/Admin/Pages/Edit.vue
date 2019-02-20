<template>
  <div class="h-100">
    <editor-toolbar :back-link="{name: 'admin.pages'}"
                    @delete="handleDeletePage"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
    <div class="container scrollable">
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
import EditorToolbar from '@/components/Admin/EditorToolbar'

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
      this.$crm.pageUpdate(this.page).then(() => {
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
    EditorToolbar,
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
</style>
