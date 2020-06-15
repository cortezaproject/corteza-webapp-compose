<template>
  <div
    class="d-flex flex-column w-100 vh-100"
  >
    <div
      class="flex-grow-1 overflow-auto w-100"
    >
      <b-container>
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
              <b-row align-v="center">
                <b-col cols="6">
                  <b-form-group
                    :label="$t('namespace.slug.label')"
                    :description="$t('namespace.slug.description')"
                  >
                    <b-form-input
                      v-model="namespace.slug"
                      type="text"
                      :state="slugState"
                      :placeholder="$t('namespace.slug.placeholder')" />

                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-checkbox v-model="namespace.enabled" size="lg">
                    {{ $t('namespace.enabled.label') }}
                  </b-form-checkbox>
                </b-col>
              </b-row>
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
      :hideDelete="!canDelete"
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
      namespace: new compose.Namespace({ enabled: true }),
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
    this.fetchNamespace(this.$route.params.namespaceID)
  },

  methods: {
    fetchNamespace (namespaceID) {
      if (namespaceID) {
        this.$store.dispatch('namespace/findByID', { namespaceID: namespaceID }).then((ns) => {
          this.namespace = new compose.Namespace(ns)
        })
      }
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      const { namespaceID, name, slug, enabled, meta } = this.namespace
      if (this.isEdit) {
        this.$store.dispatch('namespace/update', { namespaceID, name, slug, enabled, meta }).then((ns) => {
          this.namespace = new compose.Namespace(ns)

          this.raiseSuccessAlert(this.$t('notification.namespace.saved'))
          if (closeOnSuccess) {
            this.$router.push({ name: 'root' })
          }
        }).catch(({ message }) => this.raiseWarningAlert(message, this.$t('notification.namespace.saveFailed')))
      } else {
        this.$store.dispatch('namespace/create', { name, slug, enabled, meta }).then((ns) => {
          this.namespace = new compose.Namespace(ns)

          this.raiseSuccessAlert(this.$t('notification.namespace.saved'))
          if (closeOnSuccess) {
            this.$router.push({ name: 'root' })
          }
        }).catch(({ message }) => this.raiseWarningAlert(message, this.$t('notification.namespace.createFailed')))
      }
    },

    handleDelete () {
      const { namespaceID } = this.namespace
      this.$store.dispatch('namespace/delete', { namespaceID }).then(() => {
        this.$router.push({ name: 'root' })
      }).catch(({ message }) => this.raiseWarningAlert(message, this.$t('notification.namespace.deleteFailed')))
    },
  },
}
</script>
