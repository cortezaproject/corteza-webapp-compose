<template>
  <b-container>
    <h1 class="text-center mt-4">
      {{ getTitle }}
      <c-permissions-button
        v-if="isEdit && namespace.canGrant"
        :title="namespace.name"
        :resource="'compose:namespace:'+namespace.namespaceID"
        link />

    </h1>
    <b-form>
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
          <b-form-group :label="$t('namespace.slug.label')" :description="$t('namespace.slug.description')">
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
    <editor-toolbar :back-link="{name: 'root'}"
                    :hideDelete="!canDelete"
                    :hideSave="!canSave"
                    @delete="handleDelete"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
    <c-permissions-modal />
  </b-container>
</template>

<script>
import { compose } from '@cortezaproject/corteza-js'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import { components } from '@cortezaproject/corteza-vue'
const { CPermissionsModal } = components

export default {
  components: {
    EditorToolbar,
    CPermissionsModal,
  },

  data () {
    return {
      namespace: new compose.Namespace(),
    }
  },

  computed: {
    getTitle () {
      return this.isEdit ? this.$t('namespace.edit', { name: this.namespace.name }) : this.$t('namespace.create')
    },

    isEdit () {
      return this.namespace && !!this.namespace.namespaceID
    },

    slugState () {
      return this.namespace ? this.namespace.slug.length > 0 : null
    },

    nameState () {
      return this.namespace ? this.namespace.name.length > 0 : null
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

      return !!this.namespace.name && !!this.namespace.slug
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
        }).catch(this.raiseWarningAlert(this.$t('notification.namespace.saveFailed')))
      } else {
        this.$store.dispatch('namespace/create', { name, slug, enabled, meta }).then((ns) => {
          this.namespace = new compose.Namespace(ns)

          this.raiseSuccessAlert(this.$t('notification.namespace.saved'))
          if (closeOnSuccess) {
            this.$router.push({ name: 'root' })
          }
        }).catch(this.raiseWarningAlert(this.$t('notification.namespace.createFailed')))
      }
    },

    handleDelete () {
      const { namespaceID } = this.namespace
      this.$store.dispatch('namespace/delete', { namespaceID }).then(() => {
        this.$router.push({ name: 'root' })
      }).catch(this.raiseWarningAlert(this.$t('notification.namespace.deleteFailed')))
    },
  },
}
</script>
