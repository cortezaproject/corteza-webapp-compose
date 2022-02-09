<template>
  <div class="py-3">
    <portal to="topbar-title">
      {{ $t('edit.edit') }}
    </portal>

    <portal to="topbar-tools">
      <b-button-group
        v-if="page && page.canUpdatePage"
        size="sm"
        class="mr-1"
      >
        <b-button
          variant="primary"
          style="margin-right:2px;"
          class="d-flex align-items-center"
          :to="{ name: 'admin.pages.builder' }"
        >
          {{ $t('label.pageBuilder') }}
          <font-awesome-icon
            :icon="['fas', 'cogs']"
            class="ml-2"
          />
        </b-button>
        <page-translator
          v-if="page"
          :page="page"
        />
        <b-button
          variant="primary"
          class="d-flex align-items-center"
          :to="pageViewer"
        >
          <font-awesome-icon
            :icon="['far', 'eye']"
          />
        </b-button>
      </b-button-group>
    </portal>

    <b-container fluid="xl">
      <b-row no-gutters>
        <b-col>
          <b-card
            no-body
            class="shadow-sm"
          >
            <b-form
              class="px-4 py-3"
            >
              <b-row>
                <b-col
                  cols="12"
                  md="6"
                  xl="4"
                >
                  <input
                    id="id"
                    v-model="page.pageID"
                    required
                    type="hidden"
                  >
                  <label class="text-primary">{{ $t('newPlaceholder') }}</label>
                  <b-form-input
                    v-model="page.title"
                    required
                    class="mb-2"
                    :placeholder="$t('newPlaceholder')"
                  />
                </b-col>
                <b-col
                  cols="12"
                  md="6"
                  xl="4"
                >
                  <label class="text-primary">{{ $t('label.handle') }}</label>
                  <b-form-input
                    v-model="page.handle"
                    :state="handleState"
                    class="mb-2"
                    :placeholder="$t('block.general.placeholder.handle')"
                  />
                  <b-form-invalid-feedback :state="handleState">
                    {{ $t('block.general.invalid-handle-characters') }}
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
              <label class="text-primary mt-3">{{ $t('label.description') }}</label>
              <b-form-textarea
                v-model="page.description"
                :placeholder="$t('edit.pageDescription')"
                class="mb-2"
                rows="8"
              />
              <b-form-checkbox
                id="visible"
                v-model="page.visible"
                switch
                size="lg"
                class="mt-3 d-inline"
              />
              <label class="m-1">
                {{ $t('edit.visible') }}
              </label>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <portal to="admin-toolbar">
      <editor-toolbar
        :back-link="{name: 'admin.pages'}"
        :hide-delete="!page.canDeletePage"
        :disable-delete="hasChildren"
        :delete-tooltip="hasChildren ? $t('deleteDisabled') : ''"
        :hide-save="!page.canUpdatePage"
        hide-clone
        @delete="handleDeletePage"
        @save="handleSave()"
        @saveAndClose="handleSave({ closeOnSuccess: true })"
      />
    </portal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import PageTranslator from 'corteza-webapp-compose/src/components/Admin/Page/PageTranslator'
import { compose } from '@cortezaproject/corteza-js'
import { handleState } from 'corteza-webapp-compose/src/lib/handle'

export default {
  i18nOptions: {
    namespaces: 'page',
  },

  name: 'PageEdit',

  components: {
    EditorToolbar,
    PageTranslator,
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
    ...mapGetters({
      pages: 'page/set',
    }),

    handleState () {
      return handleState(this.page.handle)
    },

    pageViewer () {
      return { name: 'page', params: { pageID: this.pageID } }
    },

    hasChildren () {
      return this.pages.some(({ selfID }) => selfID === this.page.pageID)
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
    }).catch(this.toastErrorHandler(this.$t('notification:page.loadFailed')))
  },

  methods: {
    ...mapActions({
      findPageByID: 'page/findByID',
      updatePage: 'page/update',
      deletePage: 'page/delete',
    }),

    handleSave ({ closeOnSuccess = false } = {}) {
      /**
       * Pass a special tag alongside payload that
       * instructs store layer to add content-language header to the API request
       */
      const resourceTranslationLanguage = this.currentLanguage
      const { namespaceID } = this.namespace
      this.updatePage({ namespaceID, ...this.page, resourceTranslationLanguage }).then((page) => {
        this.page = page.clone()
        this.toastSuccess(this.$t('notification:page.saved'))
        if (closeOnSuccess) {
          this.$router.push({ name: 'admin.pages' })
        }
      }).catch(this.toastErrorHandler(this.$t('notification:page.saveFailed')))
    },

    handleDeletePage () {
      this.deletePage(this.page).then(() => {
        this.$router.push({ name: 'admin.pages' })
      }).catch(this.toastErrorHandler(this.$t('notification:page.deleteFailed')))
    },
  },
}
</script>
