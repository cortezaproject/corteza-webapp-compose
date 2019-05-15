<template>
  <div class="scrollable">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well">
            <h2>{{ $t('page.edit.title') }}</h2>
            <router-link :to="{name: 'admin.pages.builder'}" class="btn-url float-right">{{ $t('general.label.pageBuilder') }}</router-link>
            <form @submit.prevent="handleSave()">
              <input required type="hidden" v-model="page.pageID" id="id" />
              <div class="form-group">
                <label for="title">{{ $t('page.newPlaceholder') }}</label>
                <input required type="text" v-model="page.title" class="form-control" id="title" :placeholder="$t('page.newPlaceholder')" />
              </div>
              <div class="form-group">
                <label for="title">{{ $t('general.label.description') }}</label>
                <textarea v-model="page.description" class="form-control" id="description" :placeholder="$t('page.edit.pageDescription')" />
              </div>
              <div class="form-group form-check">
                <input type="checkbox" id="visible" class="form-check-input" v-model="page.visible">
                <label for="visible" class="form-check-label">{{ $t('page.edit.visible') }}?</label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <editor-toolbar :back-link="{name: 'admin.pages'}"
                    @delete="handleDeletePage"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
  </div>
</template>

<script>
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import EditorToolbar from '@/components/Admin/EditorToolbar'
import Namespace from '@/lib/namespace'

export default {
  name: 'PageEdit',

  components: {
    ConfirmationToggle,
    EditorToolbar,
  },

  props: {
    namespace: {
      type: Namespace,
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
      page: {},
    }
  },

  created () {
    const { namespaceID } = this.namespace
    this.$compose.pageRead({ namespaceID, pageID: this.pageID }).then((page) => {
      if (page.moduleID !== '0') {
        // Do not allow to edit record pages, move to builder
        this.$router.replace({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
      }

      this.page = page
    }).catch(this.defaultErrorHandler(this.$t('notification.page.loadFailed')))
  },
  methods: {
    handleSave ({ closeOnSuccess = false } = {}) {
      const { namespaceID } = this.namespace
      this.$compose.pageUpdate({ namespaceID, ...this.page }).then((page) => {
        this.page = page
        this.raiseSuccessAlert(this.$t('notification.page.saved'))
        if (closeOnSuccess) {
          this.$router.push({ name: 'admin.pages' })
        }
      }).catch(this.defaultErrorHandler(this.$t('notification.page.saveFailed')))
    },

    handleDeletePage () {
      this.$compose.pageDelete(this.page).then(() => {
        this.$router.push({ name: 'admin.pages' })
      }).catch(this.defaultErrorHandler(this.$t('notification.page.deleteFailed')))
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

textarea {
  &.form-control {
    min-height: 200px;
  }
}

h2 {
  display: inline-block;
}

.form-check {
  display: inline-block;

  &-label {
    line-height: 24px;
    margin-left: 5px;
  }
}
</style>
