<template>
  <div
    class="d-flex flex-column w-100 vh-100"
  >
    <div
      class="flex-grow-1 overflow-auto w-100"
    >
      <b-container
        v-if="loaded"
      >
        <b-row>
          <b-col
            offset-lg="2"
            xl="8"
          >
            <div
             class="float-right mt-3"
            >
              <c-permissions-button
                v-if="isEdit && namespace.canGrant"
                :title="namespace.name"
                :target="namespace.name"
                :resource="'compose:namespace:'+namespace.namespaceID"
                link
              />
            </div>
            <b-form>
              <h1 class="text-center mt-4">
                {{ isEdit ? $t('namespace.edit') : $t('namespace.create') }}
              </h1>
              <b-form-group :label="$t('namespace.name.label')">
                <b-form-input
                  v-model="namespace.name"
                  type="text"
                  required
                  :state="nameState"
                  :placeholder="$t('namespace.name.placeholder')" />

              </b-form-group>
              <div
                class="d-flex align-items-baseline"
              >
                <b-form-group
                  :label="$t('namespace.slug.label')"
                  :description="$t('namespace.slug.description')"
                  class="w-50"
                >
                  <b-form-input
                    v-model="namespace.slug"
                    type="text"
                    :state="slugState"
                    :placeholder="$t('namespace.slug.placeholder')"
                  />
                </b-form-group>

                <b-form-group
                  class="ml-auto mr-auto"
                >
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
              </div>
              <b-form-group :label="$t('namespace.subtitle.label')">
                <b-form-input
                  v-model="namespace.meta.subtitle"
                  type="text"
                  :placeholder="$t('namespace.subtitle.placeholder')" />

              </b-form-group>

              <b-form-group :label="$t('namespace.description.label')">
                <b-form-textarea
                  v-model="namespace.meta.description"
                  :placeholder="$t('namespace.description.placeholder')"
                  rows="3"
                  max-rows="5" />

              </b-form-group>
            </b-form>
          </b-col>
        </b-row>
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
    <c-permissions-modal />
  </div>
</template>

<script>
import { compose, NoID } from '@cortezaproject/corteza-js'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import { components } from '@cortezaproject/corteza-vue'
import { handleState } from 'corteza-webapp-compose/src/lib/handle'
const { CPermissionsModal } = components

export default {
  components: {
    EditorToolbar,
    CPermissionsModal,
  },

  data () {
    return {
      loaded: false,

      namespace: new compose.Namespace({ enabled: true }),

      application: undefined,
      isApplication: false,
      canCreateApplication: false,
    }
  },

  computed: {
    isEdit () {
      return this.namespace && this.namespace.namespaceID !== NoID
    },

    slugState () {
      return handleState(this.namespace.slug)
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

      return !!this.namespace.name
    },
  },

  created () {
    this.fetchEffective()
    this.fetchNamespace(this.$route.params.namespaceID)
  },

  methods: {
    async fetchNamespace (namespaceID) {
      if (namespaceID) {
        this.$store.dispatch('namespace/findByID', { namespaceID })
          .then((ns) => {
            this.namespace = new compose.Namespace(ns)
            this.fetchApplication()
          })
      }
    },

    fetchApplication () {
      this.$SystemAPI.applicationList({ query: this.namespace.name })
        .then(({ set = [] }) => {
          if (set.length) {
            this.application = set[0]
            this.isApplication = this.application.enabled
          }
          this.loaded = true
        })
        .catch(this.defaultErrorHandler(this.$t('notification.namespace.application.fetchFailed')))
    },

    fetchEffective () {
      this.$SystemAPI.permissionsEffective({ resource: 'application' })
        .then(p => {
          this.canCreateApplication = p.find(per => per.operation === 'application.create').allow || false
        })
    },

    async handleSave ({ closeOnSuccess = false } = {}) {
      const { namespaceID, name, slug, enabled, meta } = this.namespace

      await this.handleApplicationSave()

      if (this.isEdit) {
        this.$store.dispatch('namespace/update', { namespaceID, name, slug, enabled, meta }).then((ns) => {
          this.namespace = new compose.Namespace(ns)

          this.raiseSuccessAlert(this.$t('notification.namespace.saved'))
          if (closeOnSuccess) {
            this.$router.push({ name: 'root' })
          }
        }).catch(this.defaultErrorHandler(this.$t('notification.namespace.saveFailed')))
      } else {
        this.$store.dispatch('namespace/create', { name, slug, enabled, meta }).then((ns) => {
          this.namespace = new compose.Namespace(ns)

          this.raiseSuccessAlert(this.$t('notification.namespace.saved'))
          if (closeOnSuccess) {
            this.$router.push({ name: 'root' })
          }
        }).catch(this.defaultErrorHandler(this.$t('notification.namespace.createFailed')))
      }
    },

    handleDelete () {
      const { namespaceID } = this.namespace
      this.$store.dispatch('namespace/delete', { namespaceID }).then(() => {
        this.$router.push({ name: 'root' })
      }).catch(this.defaultErrorHandler(this.$t('notification.namespace.deleteFailed')))
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

        return this.$SystemAPI.applicationUpdate({ ...this.application, enabled })
          .then(app => { this.application = app })
          .catch(this.defaultErrorHandler(this.$t('notification.namespace.application.saveFailed')))
      } else if (this.isApplication) {
        // If namespace not an application - create one and enable
        const application = {
          name: this.namespace.slug,
          enabled: true,
          unify: {
            name: this.namespace.name,
            listed: true,
            url: `/compose/ns/${this.namespace.slug}/pages`,
            icon: '/applications/default_icon.png',
            logo: '/applications/default_logo.jpg',
          },
        }
        return this.$SystemAPI.applicationCreate({ ...application })
          .then(app => { this.application = app })
          .catch(this.defaultErrorHandler(this.$t('notification.namespace.application.createFailed')))
      }
    },
  },
}
</script>
