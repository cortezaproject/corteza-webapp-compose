<template>
  <div class="scrollable">
    <div class="container">
      <h1 v-if="isEdit" class="text-center mt-4">{{ $t('namespace.edit', {name: namespace.name}) }}</h1>
      <h1 v-else class="text-center mt-4">{{ $t('namespace.create') }}</h1>

      <form class="col-12">
        <fieldset class="form-group">
          <div class="form-group">
            <label for="name">{{ $t('general.label.name') }}</label>
            <input
              v-model="namespace.name"
              type="text"
              class="form-control form-control-lg"
              id="name"
              placeholder="Namespace name">
          </div>

          <div class="form-group">
            <label for="subtitle">{{ $t('namespace.label.subtitle') }}</label>
            <input
              v-model="namespace.meta.subtitle"
              type="text"
              class="form-control"
              id="subtitle"
              placeholder="Namespace subtitle">
          </div>

          <div class="form-group">
            <label for="description">{{ $t('general.label.name') }}</label>
            <textarea
              v-model="namespace.meta.description"
              rows="3"
              class="form-control"
              id="description"
              placeholder="Namespace description"/>
          </div>

          <div class="row no-gutters">
            <div class="col-12 col-md-7 form-group">
              <label for="slug">{{ $t('namespace.label.slug') }}</label>
              <input
                v-model="namespace.slug"
                type="text"
                class="form-control form-control-sm"
                id="slug"
                placeholder="Namespace slug">

            </div>

            <div class="col-6 col-md-2 enabled form-check">
              <input
                v-model="namespace.enabled"
                type="checkbox"
                class="form-check-input"
                id="enabled">
              <label for="enabled">{{ $t('namespace.label.enabled') }}</label>
            </div>

            <div v-if="isEdit" class="col-6 col-md-3 permissions actions">
              {{ $t('Set permissions') }}
              <permissions-button :resource="'compose:namespace:'+namespace.namespaceID" link />
            </div>
          </div>
        </fieldset>
      </form>
    </div>
    <editor-toolbar :back-link="{name: 'root'}"
                    :hideDelete="!isEdit || !namespace.canDeleteNamespace"
                    :hideSave="!namespace.canUpdateNamespace"
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
import { PermissionsModal } from 'crust-common.vue/components'

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
  },

  created () {
    this.fetchNamespace()
  },

  methods: {
    fetchNamespace () {
      const namespaceID = this.$route.params.namespaceID
      if (namespaceID) {
        this.$compose.namespaceRead({ namespaceID: namespaceID }).then((ns) => {
          console.log(ns)
          this.namespace = new Namespace(ns)
          console.log(this.namespace)
        })
      }
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      const { namespaceID, name, slug, enabled, meta } = this.namespace
      if (this.isEdit) {
        this.$compose.namespaceUpdate({ namespaceID, name, slug, enabled, meta }).then((ns) => {
          this.raiseSuccessAlert(this.$t('notification.namespace.saved'))
          if (closeOnSuccess) {
            this.$router.push({ name: 'root' })
          }
        }).catch(this.defaultErrorHandler(this.$t('notification.namespace.saveFailed')))
      } else {
        this.$compose.namespaceCreate({ name, slug, enabled, meta }).then((ns) => {
          this.namespace.namespaceID = ns.namespaceID
          this.raiseSuccessAlert(this.$t('notification.namespace.saved'))
          if (closeOnSuccess) {
            this.$router.push({ name: 'root' })
          }
        }).catch(this.defaultErrorHandler(this.$t('notification.namespace.updateFailed')))
      }
    },

    handleDelete () {
      const { namespaceID } = this.namespace
      this.$compose.namespaceDelete({ namespaceID }).then(() => {
        this.$router.push({ name: 'root' })
      }).catch(this.defaultErrorHandler(this.$t('notification.namespace.deleteFailed')))
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

.enabled {
  text-align: center;
  margin-top: 10px;
}

.permissions {
  text-align: center;
  margin-top: 12px;
}

.row {
  align-items: center;
}
</style>
