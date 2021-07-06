<template>
  <div
    v-if="loaded"
    class="d-flex flex-column w-100 h-100"
  >
    <portal to="topbar-title">
      {{ pageTitle }}
    </portal>

    <portal to="topbar-tools">
      <b-button
        v-if="isEdit"
        variant="primary"
        class="d-flex align-items-center"
        :to="openNamespace"
      >
        {{ $t('namespace.visit') }}
      </b-button>
    </portal>

    <div class="flex-grow-1 overflow-auto mb-2">
      <b-container
        fluid="xl"
        class="flex-grow-1"
      >
        <div
          v-if="isEdit"
          class="d-flex align-items-center mb-2"
        >
          <b-btn
            :to="{ name: 'namespace.create' }"
            variant="primary"
            size="lg"
          >
            {{ $t('namespace.create') }}
          </b-btn>
          <c-permissions-button
            v-if="namespace.canGrant"
            :title="namespace.name"
            :target="namespace.name"
            :resource="'corteza::compose:namespace/'+namespace.namespaceID"
            buttonVariant="light"
            :buttonLabel="$t('general.label.permissions')"
            class="ml-1 btn-lg"
          />
        </div>

        <b-card
          body-class="p-3"
        >
          <b-form>
            <b-form-group :label="$t('namespace.name.label')">
              <b-form-input
                v-model="namespace.name"
                type="text"
                required
                :state="nameState"
                :placeholder="$t('namespace.name.placeholder')" />
            </b-form-group>
            <b-form-group
              :label="$t('namespace.slug.label')"
              :description="$t('namespace.slug.description')"
            >
              <b-form-input
                v-model="namespace.slug"
                type="text"
                :state="slugState"
                :placeholder="$t('namespace.slug.placeholder')"
              />
            </b-form-group>
            <b-form-group>
              <b-form-checkbox
                v-model="namespace.enabled"
                class="mb-3"
              >
                {{ $t('namespace.enabled.label') }}
              </b-form-checkbox>
              <b-form-checkbox
                v-model="isApplication"
                :disabled="!canToggleApplication"
              >
                {{ $t('namespace.application.label') }}
              </b-form-checkbox>
            </b-form-group>
            <hr>
            <b-form-group>
              <template #label>
                <div class="d-flex align-items-center">
                  {{ $t('namespace.logo.label') }}
                  <b-button
                    variant="primary"
                    size="sm"
                    class="py-0 ml-2"
                    v-b-modal.logo
                  >
                    Preview
                  </b-button>
                </div>
              </template>

                <!-- v-model="namespace.logo" -->
              <b-form-file
                v-model="namespaceAssets.logo"
                accept="image/*"
                :placeholder="$t('namespace.logo.placeholder')"
              />
            </b-form-group>

            <b-form-group>
              <template #label>
                <div class="d-flex align-items-center">
                  {{ $t('namespace.icon.label') }}
                  <b-button
                    v-if="namespace.meta.icon"
                    variant="primary"
                    class="py-0 ml-2"
                    v-b-modal.icon
                  >
                    Preview
                  </b-button>
                </div>
              </template>
              <b-form-file
                v-model="namespaceAssets.icon"
                accept="image/*"
                :placeholder="$t('namespace.icon.placeholder')"
              />
            </b-form-group>

            <b-form-group :label="$t('namespace.subtitle.label')">
              <b-form-input
                v-model="namespace.meta.subtitle"
                type="text"
                :placeholder="$t('namespace.subtitle.placeholder')" />

            </b-form-group>

            <b-form-group
              :label="$t('namespace.description.label')"
              class="mb-0"
            >
              <b-form-textarea
                v-model="namespace.meta.description"
                :placeholder="$t('namespace.description.placeholder')"
                rows="1"
              />

            </b-form-group>
          </b-form>
        </b-card>
      </b-container>
    </div>

    <editor-toolbar
      :back-link="{name: 'root'}"
      :hideDelete="!loaded"
      :hideSave="!loaded"
      :disableDelete="!canDelete"
      :disableSave="!canSave"
      @delete="handleDelete"
      @save="handleSave()"
      @saveAndClose="handleSave({ closeOnSuccess: true })"
    />

    <b-modal
      id="logo"
      hide-header
      hide-footer
      centered
      body-class="p-1"
    >
      <div class="ns-wrap">
        <div>
          <b-img
            v-if="logoPreview"
            :src="logoPreview"
            fluid-grow
          />
          <div
            v-else
            class="ns-logo"
          >
            <i class="d-block m-auto" />
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal
      id="icon"
      hide-header
      hide-footer
      centered
      body-class="p-1"
    >
      <div class="ns-wrap">
        <div>
          <b-img
            :src="iconPreview"
            fluid-grow
          />
        </div>
      </div>
    </b-modal>

  </div>
</template>

<script>
import { compose, NoID } from '@cortezaproject/corteza-js'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import { handleState } from 'corteza-webapp-compose/src/lib/handle'
import { mapGetters } from 'vuex'

export default {
  components: {
    EditorToolbar,
  },

  data () {
    return {
      loaded: false,

      namespace: new compose.Namespace({ enabled: true }),
      namespaceAssets: {
        logo: undefined,
        icon: undefined,
      },

      application: undefined,
      isApplication: false,
    }
  },

  computed: {
    ...mapGetters({
      can: 'rbac/can',
    }),

    canCreateApplication () {
      return this.can('automation/', 'application.create')
    },

    pageTitle () {
      return this.isEdit ? this.$t('namespace.edit') : this.$t('namespace.create')
    },

    openNamespace () {
      return { name: 'pages', params: { slug: (this.namespace.slug || this.namespace.namespaceID) } }
    },

    isEdit () {
      return this.namespace && this.namespace.namespaceID !== NoID
    },

    slugState () {
      return handleState(this.namespace.slug)
    },

    logoPreview () {
      return this.namespace.meta.logo || ''
    },

    iconPreview () {
      return this.namespace.meta.icon || ''
    },

    nameState () {
      if (!this.isEdit && this.namespace.name.length === 0) {
        return null
      }

      return this.namespace.name.length > 0
    },

    canToggleApplication () {
      return this.canCreateApplication
    },

    canDelete () {
      if (this.isEdit) {
        return this.namespace.canDeleteNamespace
      }

      return false
    },

    canSave () {
      if (this.isEdit && !this.namespace.canUpdateNamespace) {
        return false
      }

      return this.nameState && this.slugState
    },
  },

  watch: {
    '$route.params.namespaceID': {
      immediate: true,
      handler (namespaceID) {
        this.fetchNamespace(namespaceID)
      },
    },
  },

  methods: {
    async fetchNamespace (namespaceID) {
      if (namespaceID) {
        await this.$store.dispatch('namespace/findByID', { namespaceID })
          .then((ns) => {
            this.namespace = new compose.Namespace(ns)
            this.fetchApplication()
          })
      } else {
        this.namespace = new compose.Namespace({ enabled: true })
        this.application = undefined
        this.isApplication = false
      }

      this.loaded = true
    },

    fetchApplication () {
      this.$SystemAPI.applicationList({ query: this.namespace.name })
        .then(({ set = [] }) => {
          if (set.length) {
            this.application = set[0]
            this.isApplication = this.application.enabled
          }
        })
        .catch(this.toastErrorHandler(this.$t('notification.namespace.application.fetchFailed')))
    },

    async handleSave ({ closeOnSuccess = false } = {}) {
      let { namespaceID, name, slug, enabled, meta } = this.namespace
      let assets

      // Firstly handle any new namespace assets
      if (this.namespaceAssets.logo || this.namespaceAssets.icon) {
        try {
          assets = await this.uploadAssets()
          meta = { ...meta, ...assets }
        } catch (e) {
          this.toastErrorHandler(this.$t('notification.namespace.assetUploadFailed'))(e)
          return
        }
      }

      if (this.isEdit) {
        try {
          await this.$store.dispatch('namespace/update', { namespaceID, name, slug, enabled, meta }).then((ns) => {
            this.namespace = new compose.Namespace(ns)

            this.toastSuccess(this.$t('notification.namespace.saved'))
          })
        } catch (e) {
          this.toastErrorHandler(this.$t('notification.namespace.saveFailed'))(e)
          return
        }
      } else {
        try {
          await this.$store.dispatch('namespace/create', { name, slug, enabled, meta }).then((ns) => {
            this.namespace = new compose.Namespace(ns)

            this.toastSuccess(this.$t('notification.namespace.saved'))
          })
        } catch (e) {
          this.toastErrorHandler(this.$t('notification.namespace.createFailed'))(e)
          return
        }
      }

      await this.handleApplicationSave()
        .catch(() => this.toastErrorHandler(this.$t('notification.namespace.createAppFailed')))

      if (closeOnSuccess) {
        this.$router.push({ name: 'root' })
      }
    },

    handleDelete () {
      const { namespaceID } = this.namespace
      this.$store.dispatch('namespace/delete', { namespaceID }).then(() => {
        this.$router.push({ name: 'root' })
      }).catch(this.toastErrorHandler(this.$t('notification.namespace.deleteFailed')))
    },

    async handleApplicationSave () {
      if (this.application) {
        this.application.name = this.namespace.slug
        this.application.unify.name = this.namespace.name
        this.application.unify.url = `/compose/ns/${this.namespace.slug}/pages`

        let enabled = this.application.enabled
        if (this.isApplication && !this.application.enabled) {
          enabled = true
        } else if (!this.isApplication && this.application.enabled) {
          enabled = false
        }

        this.application.unify.listed = enabled

        // Assets
        // Don't take note of the ID, it will be different on the system side
        this.application.unify.icon = this.application.unify.icon || this.namespace.meta.icon
        this.application.unify.logo = this.application.unify.logo || this.namespace.meta.logo

        return this.$SystemAPI.applicationUpdate({ ...this.application, enabled })
          .then(app => { this.application = app })
          .catch(this.toastErrorHandler(this.$t('notification.namespace.application.saveFailed')))
      } else if (this.isApplication) {
        // If namespace not an application - create one and enable
        const application = {
          name: this.namespace.slug,
          enabled: true,
          unify: {
            name: this.namespace.name,
            listed: true,
            url: `compose/ns/${this.namespace.slug}/pages`,
            icon: this.namespace.meta.icon || 'applications/default_icon.png',
            logo: this.namespace.meta.logo || 'applications/default_logo.jpg',
          },
        }
        return this.$SystemAPI.applicationCreate({ ...application })
          .then(app => { this.application = app })
          .catch(this.toastErrorHandler(this.$t('notification.namespace.application.createFailed')))
      }
    },

    async uploadAssets () {
      const rr = {}

      const rq = async (file) => {
        var formData = new FormData()
        formData.append('upload', file)

        const rsp = await this.$ComposeAPI.api().request({
          method: 'post',
          url: this.$ComposeAPI.namespaceUploadEndpoint(),
          data: formData,
        })
        if (rsp.data.error) {
          throw new Error(rsp.data.error)
        }
        return rsp.data.response
      }

      const baseURL = this.$ComposeAPI.baseURL

      if (this.namespaceAssets.logo) {
        const rsp = await rq(this.namespaceAssets.logo)
        rr.logo = baseURL + rsp.url
        rr.logoID = rsp.attachmentID

        this.namespaceAssets.logo = undefined
      }

      if (this.namespaceAssets.icon) {
        const rsp = await rq(this.namespaceAssets.icon)
        rr.icon = baseURL + rsp.url
        rr.iconID = rsp.attachmentID

        this.namespaceAssets.icon = undefined
      }

      return rr
    },
  },
}
</script>

<style lang="scss" scoped>
.ns-logo i {
  height: 90px;
  width: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position-y: center;
}
</style>
