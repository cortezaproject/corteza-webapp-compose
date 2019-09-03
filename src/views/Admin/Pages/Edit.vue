<template>
  <div class="mt-3 w-100 pb-5 vh-100 overflow-auto flex-grow-1">
    <b-container class="pb-5">
      <b-row>
        <b-col md="12">
          <b-card :title="$t('page.edit.title')">
            <router-link :to="{name: 'admin.pages.builder'}"
                         class="position-absolute fixed-top text-right p-2">
                         {{ $t('general.label.pageBuilder') }}</router-link>
            <b-form @submit.prevent="handleSave()">
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
              <b-form-checkbox
                               v-model="page.visible"
                               id="visible">
                               {{ $t('page.edit.visible') }}?</b-form-checkbox>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
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
import ConfirmationToggle from 'corteza-webapp-compose/src/components/Admin/ConfirmationToggle'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'
import Page from 'corteza-webapp-compose/src/lib/page'

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
    this.$ComposeAPI.pageRead({ namespaceID, pageID: this.pageID }).then((page) => {
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
      this.$ComposeAPI.pageUpdate({ namespaceID, ...this.page }).then((page) => {
        this.page = new Page(page)
        this.raiseSuccessAlert(this.$t('notification.page.saved'))
        if (closeOnSuccess) {
          this.$router.push({ name: 'admin.pages' })
        }
      }).catch(this.defaultErrorHandler(this.$t('notification.page.saveFailed')))
    },

    handleDeletePage () {
      this.$ComposeAPI.pageDelete(this.page).then(() => {
        this.$router.push({ name: 'admin.pages' })
      }).catch(this.defaultErrorHandler(this.$t('notification.page.deleteFailed')))
    },
  },
}
</script>
