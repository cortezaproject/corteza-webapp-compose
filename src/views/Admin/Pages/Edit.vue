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
          style="margin-left:2px;"
        />
        <b-button
          variant="primary"
          style="margin-left:2px;"
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

              <b-form-group
                :label="$t('label.description')"
                label-class="text-primary"
              >
                <b-form-textarea
                  v-model="page.description"
                  :placeholder="$t('edit.pageDescription')"
                  rows="4"
                />
              </b-form-group>

              <b-form-group
                v-if="!isRecordPage"
              >
                <b-form-checkbox
                  v-model="page.visible"
                  switch
                >
                  {{ $t('edit.visible') }}
                </b-form-checkbox>
              </b-form-group>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <portal to="admin-toolbar">
      <editor-toolbar
        :back-link="{name: 'admin.pages'}"
        :hide-delete="hasChildren || !page.canDeletePage"
        :hide-save="!page.canUpdatePage"
        hide-clone
        @delete="handleDeletePage"
        @save="handleSave()"
        @saveAndClose="handleSave({ closeOnSuccess: true })"
      >
        <template #delete>
          <b-dropdown
            v-if="hasChildren && page.canDeletePage"
            size="lg"
            variant="danger"
            :text="$t('general:label.delete')"
            class="mr-1"
          >
            <b-dropdown-item
              @click="handleDeletePage('rebase')"
            >
              {{ $t('delete.rebase') }}
            </b-dropdown-item>
            <b-dropdown-item
              @click="handleDeletePage('cascade')"
            >
              {{ $t('delete.cascade') }}
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </editor-toolbar>
    </portal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import PageTranslator from 'corteza-webapp-compose/src/components/Admin/Page/PageTranslator'
import { compose, NoID } from '@cortezaproject/corteza-js'
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

    isRecordPage () {
      return this.page && this.page.moduleID !== NoID
    },

    hasChildren () {
      return this.pages.some(({ selfID }) => selfID === this.page.pageID)
    },
  },

  created () {
    const { namespaceID } = this.namespace
    this.findPageByID({ namespaceID, pageID: this.pageID }).then((page) => {
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

    handleDeletePage (strategy = 'abort') {
      this.deletePage({ ...this.page, strategy }).then(() => {
        this.$router.push({ name: 'admin.pages' })
      }).catch(this.toastErrorHandler(this.$t('notification:page.deleteFailed')))
    },
  },
}
</script>
