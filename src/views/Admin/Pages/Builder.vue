<template>
  <div
    v-if="page"
    class="flex-grow-1 overflow-auto d-flex px-2 w-100"
  >
    <portal to="topbar-title">
      {{ title }}
    </portal>

    <portal to="topbar-tools">
      <b-button-group
        v-if="page && page.canUpdatePage"
        size="sm"
        class="mr-1"
      >
        <b-button
          variant="primary"
          style="margin-right:2px;"
          class="d-flex align-items-center"
          :to="pageViewer"
        >
          {{ $t('navigation.viewPage') }}
          <font-awesome-icon
            :icon="['far', 'eye']"
            class="ml-2"
          />
        </b-button>
        <b-button
          variant="primary"
          class="d-flex align-items-center"
          :disabled="pageEditorDisabled"
          :to="pageEditor"
        >
          <font-awesome-icon
            :icon="['fas', 'pen']"
          />
        </b-button>
      </b-button-group>
    </portal>

    <grid
      :blocks="page.blocks"
      editable
      @change="updatePageBlockGrid"
    >
      <template
        slot-scope="{ boundingRect, block, index }"
      >
        <div
          class="h-100 editable-block"
          :class="{ 'bg-warning': !isValid(block) }"
        >
          <div
            class="toolbox border-0 p-2 pr-3 m-0 text-light text-center"
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
              size="md"
              link
            />
          </div>
          <page-block
            v-bind="{ ...$attrs, ...$props, page, block, boundingRect, blockIndex: index }"
            :record="record"
            :module="module"
          />
        </div>
      </template>
    </grid>

    <b-modal
      size="lg"
      id="createBlockSelector"
      scrollable
      hide-footer
      :title="$t('page.build.selectBlockTitle')"
    >
      <new-block-selector
        :record-page="!!module"
        @select="editBlock($event)"
      />
    </b-modal>

    <b-modal
      :title="$t('block.general.title')"
      :ok-title="$t('page.build.addBlock')"
      ok-variant="primary"
      cancel-variant="link"
      :cancel-title="$t('general.label.cancel')"
      size="xl"
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
        :record="record"
      />
    </b-modal>

    <b-modal
      :title="$t('block.general.changeBlock')"
      :ok-title="$t('general.label.saveAndClose')"
      ok-variant="primary"
      :cancel-title="$t('general.label.cancel')"
      cancel-variant="link"
      size="xl"
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
        :block-index="editor.index"
        :record="record"
      />
    </b-modal>

    <portal to="admin-toolbar">
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
          variant="light"
          size="lg"
          class="mr-1 float-right"
          v-b-modal.createBlockSelector>
          + {{ $t('page.build.addBlock') }}
        </b-button>
      </editor-toolbar>
    </portal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import NewBlockSelector from 'corteza-webapp-compose/src/components/Admin/Page/Builder/Selector'
import Grid from 'corteza-webapp-compose/src/components/Common/Grid'
import PageBlock from 'corteza-webapp-compose/src/components/PageBlocks'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import { compose, NoID } from '@cortezaproject/corteza-js'
import Configurator from 'corteza-webapp-compose/src/components/PageBlocks/Configurator'

export default {
  components: {
    Configurator,
    Grid,
    NewBlockSelector,
    PageBlock,
    EditorToolbar,
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

      blocks: [],
    }
  },

  computed: {
    title () {
      const title = this.page.title || this.page.handle
      return this.$t('general.label.pageBuilder') + ' - ' + (title ? `"${title}"` : this.$t('general.label.noHandle'))
    },

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

    /**
     * Create a dummy record object when we are editing a record page.
     * This enables compose:record triggers & Record page blocks
     */
    record () {
      if (this.module) {
        return new compose.Record({}, this.module)
      }
      return null
    },

    pageViewer () {
      return { name: 'page', params: { pageID: this.pageID } }
    },

    pageEditorDisabled () {
      return this.page.moduleID !== NoID
    },

    pageEditor () {
      return this.page.moduleID === NoID ? { name: 'admin.pages.edit', params: { pageID: this.pageID } } : { name: 'admin.modules.edit', params: { moduleID: this.page.moduleID } }
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
      this.editor = { index, block: compose.PageBlockMaker(block) }
    },

    updatePageBlockGrid (blocks) {
      this.blocks = blocks
    },

    updateBlocks () {
      const block = compose.PageBlockMaker(this.editor.block)
      if (this.editor.index !== undefined) {
        this.page.blocks.splice(this.editor.index, 1, block)
      } else {
        this.page.blocks.push(block)
      }

      this.editor = null
    },

    async handleSave ({ closeOnSuccess = false, previewOnSuccess = false } = {}) {
      const { namespaceID } = this.namespace

      // Record blocks
      if (this.module && !this.validateModuleFieldSelection(this.module, this.page)) {
        this.toastErrorHandler(this.$t('notification.page.saveFailedRequired'))()
        return
      }

      // Cecord lines blocks
      const queue = []
      this.blocks.forEach((b, index) => {
        if (b.kind === 'RecordList' && b.options.editable) {
          const p = new Promise((resolve) => {
            this.$root.$emit(`page-block:validate:${this.page.pageID}-${(this.record || {}).recordID || '0'}-${index}`, resolve)
          })

          queue.push(p)
        }
      })

      const validated = await Promise.all(queue)
      if (validated.find(({ valid }) => !valid)) {
        this.toastErrorHandler(this.$t('notification.page.saveFailedRequired'))()
        return
      }

      this.findPageByID({ namespaceID, pageID: this.pageID, force: true })
        .then(page => {
          // Merge changes
          this.page = new compose.Page({ namespaceID, ...page, blocks: this.blocks })

          this.updatePage(this.page).then((page) => {
            this.toastSuccess(this.$t('notification.page.saved'))
            if (closeOnSuccess) {
              this.$router.push({ name: 'admin.pages' })
            } else if (previewOnSuccess) {
              this.$router.push({ name: 'page', params: { pageID: this.pageID } })
            }
            this.page = new compose.Page(page)
          }).catch(this.toastErrorHandler(this.$t('notification.page.saveFailed')))
        })
    },

    validateModuleFieldSelection (module, page) {
      // Find all required fields
      const req = new Set(module.fields.filter(({ isRequired = false }) => isRequired).map(({ name }) => name))

      // Check if all required fields are there
      for (const b of page.blocks) {
        if (b.kind !== 'Record') {
          continue
        }

        // If no fields are in Record block, means all fields are present(default), no need to check
        if (!b.options || !b.options.fields.length) {
          return true
        }

        for (const f of b.options.fields) {
          req.delete(f.name)
        }
      }

      // If required fields are satisfied, then the validation passes
      return !req.size
    },

    handleDeletePage () {
      this.deletePage(this.page).then(() => {
        this.$router.push({ name: 'admin.pages' })
      }).catch(this.toastErrorHandler(this.$t('notification.page.deleteFailed')))
    },

    /**
     * Validates block, returns true if there are no problems with it
     *
     * @param {compose.PageBlock} block
     * @returns {boolean}
     */
    isValid (block) {
      if (typeof block.validate === 'function') {
        return block.validate().length === 0
      }

      return true
    },
  },
}
</script>
<style lang="scss">
div.toolbox {
  position: absolute;
  background-color: $dark;
  bottom: 0;
  left: 0;
  z-index: 1000;
  border-top-right-radius: 10px;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
}
</style>
