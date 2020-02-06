<template>
    <div class="d-flex" v-if="page">
      <grid
        :blocks.sync="page.blocks"
        editable
      >
        <template
          slot-scope="{ boundingRect, block, index }"
        >
          <div
            class="h-100 editable-block"
          >
            <div
              class="toolbox border-0 p-2 text-light"
            >
              <b-button
                class="p-1 text-light"
                variant="link"
                @click="editBlock(block, index)"
              >
                <font-awesome-icon
                  :icon="['far', 'edit']"
                />
              </b-button>

              <c-input-confirm
                @confirmed="page.blocks.splice(index,1)"
                class="p-1"
              >
                <font-awesome-icon
                  :icon="['far', 'trash-alt']"
                />
                <template v-slot:yes>
                  {{ $t('general.label.yes') }}
                </template>
                <template v-slot:no>
                  {{ $t('general.label.no') }}
                </template>
              </c-input-confirm>
            </div>
            <page-block
              v-bind="{ ...$attrs, ...$props, page, block, boundingRect, blockIndex: index }"
            />
          </div>
        </template>
      </grid>

      <b-modal size="lg" id="createBlockSelector" hide-footer :title="$t('page.build.selectBlockTitle')">
        <new-block-selector
          :record-page="!!module"
          @select="editBlock($event)"
        />
      </b-modal>

      <b-modal
        :title="$t('block.general.title')"
        :ok-title="$t('page.build.addBlock')"
        ok-variant="dark"
        ok-only
        size="lg"
        @ok="updateBlocks"
        @hide="editor=null"
        :visible="showCreator"
        body-class="p-0 border-top-0"
        header-class="p-3 pb-0 border-bottom-0">
        <configurator
          v-if="showCreator"
          :namespace="namespace"
          :module="module"
          :page="page"
          :block.sync="editor.block"
        />
      </b-modal>

      <b-modal
        :title="$t('block.general.changeBlock')"
        :ok-title="$t('general.label.saveAndClose')"
        ok-variant="dark"
        ok-only
        size="lg"
        @ok="updateBlocks"
        @hide="editor=null"
        :visible="showEditor"
        body-class="p-0 border-top-0"
        header-class="p-3 pb-0 border-bottom-0">
        <configurator
          v-if="showEditor"
          :namespace="namespace"
          :module="module"
          :page="page"
          :block.sync="editor.block"
        />
      </b-modal>

      <editor-toolbar
        class=""
        :back-link="{name: 'admin.pages'}"
        :hideDelete="!page.canDeletePage"
        :hideSave="!page.canUpdatePage"
        @save="handleSave()"
        @delete="handleDeletePage"
        @saveAndClose="handleSave({ closeOnSuccess: true })"
      >
        <b-button
          v-if="page.canUpdatePage"
          variant="outline-secondary"
          class="mr-1"
          v-b-modal.createBlockSelector>
          + {{ $t('page.build.addBlock') }}
        </b-button>
        <b-button
          v-if="page.canUpdatePage"
          variant="outline-secondary"
          class="mr-1"
          @click.prevent="handleSave({ previewOnSuccess: true })"
        >
          {{ $t('general.label.saveAndPreview') }}
        </b-button>
      </editor-toolbar>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import NewBlockSelector from 'corteza-webapp-compose/src/components/Admin/Page/Builder/Selector'
import Grid from 'corteza-webapp-compose/src/components/Common/Grid'
import PageBlock from 'corteza-webapp-compose/src/components/PageBlocks'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import { compose } from '@cortezaproject/corteza-js'
import Configurator from 'corteza-webapp-compose/src/components/PageBlocks/Configurator'
import { components } from '@cortezaproject/corteza-vue'
const { CInputConfirm } = components

export default {
  components: {
    Configurator,
    Grid,
    NewBlockSelector,
    PageBlock,
    EditorToolbar,
    CInputConfirm,
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
      editor: null,
      page: null,
    }
  },

  computed: {
    showEditor () {
      return this.editor && this.editor.index !== undefined
    },

    showCreator () {
      return this.editor && this.editor.index === undefined
    },

    module () {
      if (this.page && this.page.moduleID !== '0') {
        return this.$store.getters['module/getByID'](this.page.moduleID)
      } else {
        return undefined
      }
    },
  },

  mounted () {
    const { namespaceID } = this.namespace
    this.findPageByID({ namespaceID, pageID: this.pageID, force: true }).then(page => {
      this.page = page.clone()
    })
  },

  methods: {
    ...mapActions({
      findPageByID: 'page/findByID',
      updatePage: 'page/update',
      deletePage: 'page/delete',
    }),

    editBlock (block, index = undefined) {
      this.$bvModal.hide('createBlockSelector')
      this.editor = { index, block }
    },

    updateBlocks () {
      const block = new compose.PageBlockMaker(this.editor.block) // make sure we get rid of the references
      if (this.editor.index !== undefined) {
        this.page.blocks.splice(this.editor.index, 1, block)
      } else {
        this.page.blocks.push(block)
      }

      this.editor = null
    },

    handleSave ({ closeOnSuccess = false, previewOnSuccess = false } = {}) {
      const { namespaceID } = this.namespace

      this.findPageByID({ namespaceID, pageID: this.pageID, force: true }).then(page => {
        // Merge changes
        this.page = new compose.Page({ namespaceID, ...page, blocks: this.page.blocks })

        this.updatePage(this.page).then((page) => {
          this.raiseSuccessAlert(this.$t('notification.page.saved'))
          if (closeOnSuccess) {
            this.$router.push({ name: 'admin.pages' })
          } else if (previewOnSuccess) {
            this.$router.push({ name: 'page', params: { pageID: this.pageID } })
          }

          this.page = new compose.Page(page)
        }).catch(this.defaultErrorHandler(this.$t('notification.page.saveFailed')))
      })
    },

    handleDeletePage () {
      this.deletePage(this.page).then(() => {
        this.$router.push({ name: 'admin.pages' })
      }).catch(this.defaultErrorHandler(this.$t('notification.page.deleteFailed')))
    },
  },
}
</script>
<style lang="scss">
div.toolbox {
  position: absolute;
  background-color: $dark;
  right: 0;
  top: 0;
  z-index: 10000;
  border-bottom-left-radius: 10px;
  opacity: 0.2;

  &:hover {
    opacity: 1;
  }
}
</style>
