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
              <label>{{ $t('page.newPlaceholder') }}</label>
              <b-form-input required
                            v-model="page.title"
                            class="mb-2"
                            :placeholder="$t('page.newPlaceholder')"></b-form-input>
              <label>{{ $t('general.label.handle') }}</label>
              <b-form-input v-model="page.handle"
                            :state="handleState"
                            class="mb-2"
                            :placeholder="$t('general.placeholder.handle')"></b-form-input>
              <label>{{ $t('general.label.description') }}</label>
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
import { mapActions } from 'vuex'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import { compose } from '@cortezaproject/corteza-js'
import { handleState } from 'corteza-webapp-compose/src/lib/handle'

export default {
  name: 'PageEdit',

  components: {
    EditorToolbar,
  },

  props: {
    namespace: {
      type: compose.Namespace,
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
      page: new compose.Page(),
    }
  },

  computed: {
    handleState () {
      return handleState(this.page)
    },
  },

  created () {
    const { namespaceID } = this.namespace
    this.findPageByID({ namespaceID, pageID: this.pageID }).then((page) => {
      if (page.isRecordPage) {
        // Do not allow to edit record pages, move to builder
        this.$router.replace({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
      }

      this.page = new compose.Page(page)
    }).catch(this.defaultErrorHandler(this.$t('notification.page.loadFailed')))
  },
  methods: {
    ...mapActions({
      findPageByID: 'page/findByID',
      updatePage: 'page/update',
      deletePage: 'page/delete',
    }),
    handleSave ({ closeOnSuccess = false } = {}) {
      const { namespaceID } = this.namespace
      this.updatePage({ namespaceID, ...this.page }).then((page) => {
        this.page = page.clone()
        this.raiseSuccessAlert(this.$t('notification.page.saved'))
        if (closeOnSuccess) {
          this.$router.push({ name: 'admin.pages' })
        }
      }).catch(this.defaultErrorHandler(this.$t('notification.page.saveFailed')))
    },

    handleDeletePage () {
      this.deletePage(this.page).then(() => {
        this.$router.push({ name: 'admin.pages' })
      }).catch(this.defaultErrorHandler(this.$t('notification.page.deleteFailed')))
    },
  },
}
</script>
