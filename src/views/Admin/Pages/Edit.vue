<template>
  <div class="py-3">
    <b-container fluid>
      <b-row no-gutters>
        <b-col xl="8" offset-xl="2">
          <b-card header-bg-variant="white"
                  header-class="border-bottom"
                  class="shadow-sm"
          >
            <div slot="header">
              <div class="d-flex justify-content-between align-items-center">
                <h1 class="mb-3" data-v-onboarding="page-edit">
                  {{ $t('page.edit.title') }}
                </h1>
                <router-link :to="{name: 'admin.pages.builder'}"
                             class="btn btn-light btn-lg pr-2"
                             data-v-onboarding="builder">
                             {{ $t('general.label.pageBuilder') }}
                </router-link>
              </div>
            </div>
            <b-form @submit.prevent="handleSave()">
              <b-row>
                <b-col cols="12" md="6" xl="4">
                  <input required type="hidden" v-model="page.pageID" id="id" />
                  <label class="text-primary">{{ $t('page.newPlaceholder') }}</label>
                  <b-form-input required
                                v-model="page.title"
                                class="mb-2"
                                :placeholder="$t('page.newPlaceholder')" />
                </b-col>
                <b-col cols="12" md="6" xl="4">
                  <label class="text-primary">{{ $t('general.label.handle') }}</label>
                  <b-form-input v-model="page.handle"
                                :state="handleState"
                                class="mb-2"
                                :placeholder="$t('general.placeholder.handle')" />
                </b-col>
              </b-row>
              <label class="text-primary mt-3">{{ $t('general.label.description') }}</label>
              <b-form-textarea v-model="page.description"
                               :placeholder="$t('page.edit.pageDescription')"
                               class="mb-2"
                               rows="8"></b-form-textarea>
              <b-form-checkbox v-model="page.visible"
                               switch
                               size="lg"
                               class="mt-3 d-inline"
                               id="visible" />
                <label class="m-1" data-v-onboarding="page-visibility">
                  {{ $t('page.edit.visible') }}
                </label>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <portal to="admin-toolbar">
      <editor-toolbar
        :back-link="{name: 'admin.pages'}"
        :hideDelete="!page.canDeletePage"
        :hideSave="!page.canUpdatePage"
        @delete="handleDeletePage"
        @save="handleSave()"
        @saveAndClose="handleSave({ closeOnSuccess: true })"
      />
    </portal>
    <tour name="PageEdit" ref="tour" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import { compose } from '@cortezaproject/corteza-js'
import { handleState } from 'corteza-webapp-compose/src/lib/handle'
import Tour from 'corteza-webapp-compose/src/components/Tour/Tour'

export default {
  name: 'PageEdit',

  components: {
    EditorToolbar,
    Tour,
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
      return handleState(this.page.handle)
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
    }).catch(this.toastErrorHandler(this.$t('notification.page.loadFailed')))
  },
  mounted: function () {
    this.$refs.tour.start()
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
        this.toastSuccess(this.$t('notification.page.saved'))
        if (closeOnSuccess) {
          this.$router.push({ name: 'admin.pages' })
        }
      }).catch(this.toastErrorHandler(this.$t('notification.page.saveFailed')))
    },

    handleDeletePage () {
      this.deletePage(this.page).then(() => {
        this.$router.push({ name: 'admin.pages' })
      }).catch(this.toastErrorHandler(this.$t('notification.page.deleteFailed')))
    },
  },
}
</script>
