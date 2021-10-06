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
        {{ $t('visit') }}
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
            {{ $t('create') }}
          </b-btn>

          <b-btn
            variant="light"
            size="lg"
            class="ml-1"
            @click="exportNamespace"
          >
            {{ $t('export') }}
          </b-btn>

          <c-permissions-button
            v-if="namespace.canGrant"
            :title="namespace.name"
            :target="namespace.name"
            :resource="'corteza::compose:namespace/'+namespace.namespaceID"
            button-variant="light"
            :button-label="$t('label.permissions')"
            class="ml-1 btn-lg"
          />

          <namespace-translator
            v-if="namespace"
            class="btn-lg"
            :namespace.sync="namespace"
            :disabled="isNew"
          />
        </div>

        <b-card
          body-class="p-3"
          footer-bg-variant="warning"
        >
          <b-form>
            <b-form-group :label="$t('name.label')">
              <b-input-group>
                <b-form-input
                  id="ns-nm"
                  v-model="namespace.name"
                  type="text"
                  required
                  :state="nameState"
                  :placeholder="$t('name.placeholder')"
                />
                <b-input-group-append>
                  <namespace-translator
                    :namespace="namespace"
                    highlight-key="name"
                    button-variant="light"
                    :disabled="isNew"
                  />
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-form-group
              :label="$t('slug.label')"
              :description="$t('slug.description')"
            >
              <b-form-input
                v-model="namespace.slug"
                type="text"
                :state="slugState"
                :placeholder="$t('slug.placeholder')"
              />
            </b-form-group>
            <b-form-group>
              <b-form-checkbox
                v-model="namespace.enabled"
                class="mb-3"
              >
                {{ $t('enabled.label') }}
              </b-form-checkbox>
              <b-form-checkbox
                v-model="isApplication"
                :disabled="!canToggleApplication"
              >
                {{ $t('application.label') }}
              </b-form-checkbox>
            </b-form-group>
            <hr>

            <b-form-group>
              <b-form-checkbox
                v-model="namespace.meta.logoEnabled"
              >
                {{ $t('logo.show') }}
              </b-form-checkbox>
            </b-form-group>

            <b-form-group
              v-if="namespace.meta.logoEnabled"
            >
              <template #label>
                <div class="d-flex align-items-center">
                  {{ $t('logo.label') }}
                  <b-button
                    v-b-modal.logo
                    variant="primary"
                    size="sm"
                    class="py-0 ml-2"
                  >
                    {{ $t('logo.preview') }}
                  </b-button>

                  <b-button
                    v-if="logoPreview"
                    variant="light"
                    size="sm"
                    class="py-0 ml-2"
                    @click="namespace.meta.logo = undefined"
                  >
                    {{ $t('logo.reset') }}
                  </b-button>
                </div>
              </template>

              <b-form-file
                v-model="namespaceAssets.logo"
                accept="image/*"
                :placeholder="$t('logo.placeholder')"
              />
            </b-form-group>

            <!-- <b-form-group>
              <template #label>
                <div class="d-flex align-items-center">
                  {{ $t('icon.label') }}
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
                :placeholder="$t('icon.placeholder')"
              />
            </b-form-group> -->

            <b-form-group :label="$t('subtitle.label')">
              <b-input-group>
                <b-form-input
                  v-model="namespace.meta.subtitle"
                  type="text"
                  :placeholder="$t('subtitle.placeholder')"
                />
                <b-input-group-append>
                  <namespace-translator
                    :namespace="namespace"
                    highlight-key="subtitle"
                    button-variant="light"
                    :disabled="isNew"
                  />
                </b-input-group-append>
              </b-input-group>
            </b-form-group>

            <b-form-group
              :label="$t('description.label')"
              class="mb-0"
            >
              <b-input-group>
                <b-form-textarea
                  v-model="namespace.meta.description"
                  rows="1"
                  :placeholder="$t('description.placeholder')"
                />
                <b-input-group-append>
                  <namespace-translator
                    :namespace="namespace"
                    highlight-key="description"
                    button-variant="light"
                    :disabled="isNew"
                  />
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-form>

          <template
            v-if="isClone"
            #footer
          >
            {{ $t('cloneWarning.wfInclusion') }}
          </template>
        </b-card>
      </b-container>
    </div>

    <editor-toolbar
      :back-link="{name: 'root'}"
      :hide-delete="!loaded || !isEdit"
      :hide-clone="!loaded || !isEdit"
      :hide-save="!loaded"
      :disable-delete="!canDelete"
      :disable-save="!canSave"
      @delete="handleDelete"
      @save="handleSave()"
      @clone="$router.push({ name: 'namespace.clone', params: { namespaceID: namespace.namespaceID }})"
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
import logo from 'corteza-webapp-compose/src/themes/corteza-base/img/logo.png'
import icon from 'corteza-webapp-compose/src/themes/corteza-base/img/icon.png'
import { compose, NoID } from '@cortezaproject/corteza-js'
import { url } from '@cortezaproject/corteza-vue'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import NamespaceTranslator from 'corteza-webapp-compose/src/components/Namespaces/NamespaceTranslator'
import { handleState } from 'corteza-webapp-compose/src/lib/handle'
import { mapGetters } from 'vuex'

export default {
  i18nOptions: {
    namespaces: 'namespace',
  },

  components: {
    EditorToolbar,
    NamespaceTranslator,
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
      return this.can('system/', 'application.create')
    },

    isNew () {
      return this.namespace.namespaceID === NoID
    },

    pageTitle () {
      switch (true) {
        case this.isEdit:
          return this.$t('edit')
        case this.isClone:
          return this.$t('clone')

        default:
          return this.$t('create')
      }
    },

    watchKey () {
      return `${this.$route.params.namespaceID}|${this.$route.name}`
    },

    openNamespace () {
      return { name: 'pages', params: { slug: (this.namespace.slug || this.namespace.namespaceID) } }
    },

    isEdit () {
      return this.$route.name === 'namespace.edit'
    },

    isClone () {
      return this.$route.name === 'namespace.clone'
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

      return this.slugState
    },
  },

  watch: {
    watchKey: {
      immediate: true,
      handler (namespaceID) {
        this.fetchNamespace(namespaceID)
      },
    },
  },

  methods: {
    async fetchNamespace () {
      const namespaceID = this.$route.params.namespaceID
      if (namespaceID) {
        await this.$store.dispatch('namespace/findByID', { namespaceID })
          .then((ns) => {
            if (this.isClone) {
              this.namespace = new compose.Namespace({
                ...ns,
                name: `${ns.name} (${this.$t('cloneSuffix')})`,
                slug: `${ns.slug}_${this.$t('cloneSuffix')}`,
              })
            } else {
              this.namespace = new compose.Namespace(ns)
            }

            this.fetchApplication()
          })
      } else {
        this.namespace = new compose.Namespace({ enabled: true })
        this.application = undefined
        this.isApplication = false
      }

      this.loaded = true
    },

    exportNamespace () {
      const params = {
        namespaceID: this.namespace.namespaceID,
        filename: this.namespace.name,
      }

      const exportUrl = url.Make({
        url: `${this.$ComposeAPI.baseURL}${this.$ComposeAPI.namespaceExportEndpoint(params)}`,
        query: {
          jwt: this.$auth.accessToken,
        },
      })

      window.open(exportUrl)
    },

    fetchApplication () {
      this.$SystemAPI.applicationList({ query: this.namespace.slug })
        .then(({ set = [] }) => {
          if (set.length) {
            this.application = set[0]
            this.isApplication = this.application.enabled
          }
        })
        .catch(this.toastErrorHandler(this.$t('notification.application.fetchFailed')))
    },

    async handleSave ({ closeOnSuccess = false } = {}) {
      /**
       * Pass a special tag alongside payload that
       * instructs store layer to add content-language header to the API request
       */
      const resourceTranslationLanguage = this.defaultTranslationLanguage
      let { namespaceID, name, slug, enabled, meta } = this.namespace
      let assets

      // Firstly handle any new namespace assets
      if (this.namespaceAssets.logo || this.namespaceAssets.icon) {
        try {
          assets = await this.uploadAssets()
          meta = { ...meta, ...assets }
        } catch (e) {
          this.toastErrorHandler(this.$t('notification.assetUploadFailed'))(e)
          return
        }
      }

      const payload = {
        name,
        slug,
        enabled,
        meta,
        resourceTranslationLanguage,
      }

      if (this.isEdit) {
        try {
          await this.$store.dispatch('namespace/update', { ...payload, namespaceID }).then((ns) => {
            this.namespace = new compose.Namespace(ns)

            this.toastSuccess(this.$t('notification.saved'))
          })
        } catch (e) {
          this.toastErrorHandler(this.$t('notification.saveFailed'))(e)
          return
        }
      } else if (this.isClone) {
        try {
          await this.$store.dispatch('namespace/clone', { namespaceID, name, slug, enabled, meta }).then((ns) => {
            this.namespace = new compose.Namespace(ns)

            this.toastSuccess(this.$t('notification.saved'))
          })
        } catch (e) {
          this.toastErrorHandler(this.$t('notification.cloneFailed'))(e)
          return
        }
      } else {
        try {
          await this.$store.dispatch('namespace/create', payload).then((ns) => {
            this.namespace = new compose.Namespace(ns)

            this.toastSuccess(this.$t('notification.saved'))
          })
        } catch (e) {
          this.toastErrorHandler(this.$t('notification.createFailed'))(e)
          return
        }
      }

      await this.handleApplicationSave()
        .catch(() => this.toastErrorHandler(this.$t('notification.createAppFailed')))

      if (closeOnSuccess) {
        this.$router.push({ name: 'root' })
      } else {
        this.$router.push({ name: 'namespace.edit', params: { namespaceID: this.namespace.namespaceID } })
      }
    },

    handleDelete () {
      const { namespaceID } = this.namespace
      this.$store.dispatch('namespace/delete', { namespaceID }).then(() => {
        this.$router.push({ name: 'root' })
      }).catch(this.toastErrorHandler(this.$t('notification.deleteFailed')))
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
          .catch(this.toastErrorHandler(this.$t('notification.application.saveFailed')))
      } else if (this.isApplication) {
        // If namespace not an application - create one and enable
        const application = {
          name: this.namespace.slug,
          enabled: true,
          unify: {
            name: this.namespace.name,
            listed: true,
            url: `compose/ns/${this.namespace.slug}/pages`,
            icon: this.namespace.meta.icon || this.$Settings.attachment('ui.iconLogo', icon),
            logo: this.namespace.meta.logo || this.$Settings.attachment('ui.mainLogo', logo),
          },
        }
        return this.$SystemAPI.applicationCreate({ ...application })
          .then(app => { this.application = app })
          .catch(this.toastErrorHandler(this.$t('notification.application.createFailed')))
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
