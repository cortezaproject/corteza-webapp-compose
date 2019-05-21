<template>
  <div class="scrollable">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well">
            <router-link :to="{name: 'admin.pages.builder'}"
                         class="btn-url float-right">
                         {{ $t('general.label.pageBuilder') }}</router-link>
            <h2>{{ $t('page.edit.title') }}</h2>
            <form @submit.prevent="handleSave()">
              <input required type="hidden" v-model="page.pageID" id="id" />
              <label for="title">{{ $t('page.newPlaceholder') }}</label>
              <b-form-input required
                            v-model="page.title"
                            id="title"
                            class="mb-2"
                            :placeholder="$t('page.newPlaceholder')"></b-form-input>
              <label for="title">{{ $t('general.label.description') }}</label>
              <b-form-textarea v-model="page.description"
                               :placeholder="$t('page.edit.pageDescription')"
                               class="mb-2"
                               rows="8"></b-form-textarea>
              <b-form-checkbox plain
                               v-model="page.visible"
                               id="visible">
                               {{ $t('page.edit.visible') }}?</b-form-checkbox>
            </form>
          </div>
        </div>
      </div>
    </div>
    <editor-toolbar :back-link="{name: 'admin.pages'}"
                    :hideDelete="!page.canDeletePage"
                    :hideSave="!page.canUpdatePage"
                    @delete="handleDeletePage"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
  </div>
</template>

<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import EditorToolbar from '@/components/Admin/EditorToolbar'
import Namespace from '@/lib/namespace'
import Page from '@/lib/page'

export default {
  name: 'PageEdit',

  components: {
    ConfirmationToggle,
    EditorToolbar,
  },

  props: {
    namespace: {
      type: Namespace,
      required: true,
    },

    pageID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      modulesList: [],
      page: new Page(),
    }
  },

  created () {
    const { namespaceID } = this.namespace
    this.$compose.pageRead({ namespaceID, pageID: this.pageID }).then((page) => {
      if (page.moduleID !== '0') {
        // Do not allow to edit record pages, move to builder
        this.$router.replace({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
      }

      this.page = new Page(page)
    }).catch(this.defaultErrorHandler(this.$t('notification.page.loadFailed')))
  },
  methods: {
    handleSave ({ closeOnSuccess = false } = {}) {
      const { namespaceID } = this.namespace
      this.$compose.pageUpdate({ namespaceID, ...this.page }).then((page) => {
        this.page = new Page(page)
        this.raiseSuccessAlert(this.$t('notification.page.saved'))
        if (closeOnSuccess) {
          this.$router.push({ name: 'admin.pages' })
        }
      }).catch(this.defaultErrorHandler(this.$t('notification.page.saveFailed')))
    },

    handleDeletePage () {
      this.$compose.pageDelete(this.page).then(() => {
        this.$router.push({ name: 'admin.pages' })
      }).catch(this.defaultErrorHandler(this.$t('notification.page.deleteFailed')))
    },
  },
}
</script>
