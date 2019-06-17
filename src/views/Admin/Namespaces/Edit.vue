<template>
  <div class="scrollable">
    <div class="container">
      <h1 v-if="isEdit" class="text-center mt-4">{{ $t('namespace.edit', {name: namespace.name}) }}</h1>
      <h1 v-else class="text-center mt-4">{{ $t('namespace.create') }}</h1>

      <form class="col-12">
        <fieldset class="form-group">
          <div class="form-group">
            <label for="name">{{ $t('namespace.name.label') }}</label>
            <input
              v-model="namespace.name"
              type="text"
              class="form-control form-control-lg"
              id="name"
              :placeholder="$t('namespace.name.placeholder')">
          </div>

          <div class="form-group">
            <label for="subtitle">{{ $t('namespace.subtitle.label') }}</label>
            <input
              v-model="namespace.meta.subtitle"
              type="text"
              class="form-control"
              id="subtitle"
              :placeholder="$t('namespace.subtitle.placeholder')">
          </div>

          <div class="form-group">
            <label for="description">{{ $t('namespace.description.label') }}</label>
            <textarea
              v-model="namespace.meta.description"
              rows="3"
              class="form-control"
              id="description"
              :placeholder="$t('namespace.description.placeholder')" />
          </div>

          <div class="row no-gutters">
            <div class="col-12 col-md-7 form-group">
              <label for="slug">{{ $t('namespace.slug.label') }}</label>
              <input
                v-model="namespace.slug"
                type="text"
                class="form-control form-control-sm"
                id="slug"
                :placeholder="$t('namespace.slug.placeholder')">
              <i class="desc">{{ $t('namespace.slug.description') }}</i>
            </div>

            <div class="col-6 col-md-2 enabled form-check">
              <input
                v-model="namespace.enabled"
                type="checkbox"
                class="form-check-input"
                id="enabled">
              <label for="enabled">{{ $t('namespace.enabled.label') }}</label>
            </div>

            <div v-if="isEdit && namespace.canGrant" class="col-6 col-md-3 permissions actions">
              {{ $t('namespace.setPermissions') }}
              <permissions-button :title="namespace.name" :resource="'compose:namespace:'+namespace.namespaceID" link />
            </div>
          </div>
        </fieldset>
      </form>
    </div>
    <editor-toolbar :back-link="{name: 'root'}"
                    :hideDelete="!canDelete"
                    :hideSave="!canSave"
                    @delete="handleDelete"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
    <permissions-modal />
  </div>
</template>

<script>
import Namespace from '@/lib/namespace'
import EditorToolbar from '@/components/Admin/EditorToolbar'
import { PermissionsModal } from 'corteza-webapp-common/components'

export default {
  components: {
    EditorToolbar,
    PermissionsModal,
  },

  data () {
    return {
      namespace: new Namespace(),
    }
  },

  computed: {
    isEdit () {
      return !!this.namespace.namespaceID
    },

    canDelete () {
      if (this.isEdit) {
        return this.namespace.canDeleteNamespace
      }
      return false
    },

    canSave () {
      if (this.isEdit) {
        return this.namespace.canUpdateNamespace && !!this.namespace.name && !!this.namespace.slug
      }
      return !!this.namespace.name && !!this.namespace.slug
    },
  },

  created () {
    this.namespace.namespaceID = this.$route.params.namespaceID
    this.fetchNamespace()
  },

  methods: {
    fetchNamespace () {
      const { namespaceID } = this.namespace
      if (namespaceID) {
        this.$store.dispatch('namespace/findByID', { namespaceID: namespaceID }).then((ns) => {
          this.namespace = new Namespace(ns)
        })
      }
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      const { namespaceID, name, slug, enabled, meta } = this.namespace
      if (this.isEdit) {
        this.$store.dispatch('namespace/update', { namespaceID, name, slug, enabled, meta }).then((ns) => {
          this.raiseSuccessAlert(this.$t('notification.namespace.saved'))
          if (closeOnSuccess) {
            this.$router.push({ name: 'root' })
          }
          this.fetchNamespace()
        }).catch(this.defaultErrorHandler(this.$t('notification.namespace.saveFailed')))
      } else {
        this.$store.dispatch('namespace/create', { name, slug, enabled, meta }).then((ns) => {
          this.namespace.namespaceID = ns.namespaceID
          this.raiseSuccessAlert(this.$t('notification.namespace.saved'))
          if (closeOnSuccess) {
            this.$router.push({ name: 'root' })
          }
          this.fetchNamespace()
        }).catch(this.defaultErrorHandler(this.$t('notification.namespace.updateFailed')))
      }
    },

    handleDelete () {
      const { namespaceID } = this.namespace
      this.$store.dispatch('namespace/delete', { namespaceID }).then(() => {
        this.$router.push({ name: 'root' })
      }).catch(this.defaultErrorHandler(this.$t('notification.namespace.deleteFailed')))
    },
  },
}
</script>

<style lang="scss" scoped>
.enabled {
  text-align: center;
  margin-bottom: 10px;
}

.permissions {
  text-align: center;
  margin-bottom: 8px;
}

.row {
  align-items: center;
}

.desc {
  color: $secondary;
}
</style>
