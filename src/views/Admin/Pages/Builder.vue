<template>
    <div class="builder scrollable" v-if="page">
      <grid :blocks.sync="page.blocks" editable>
        <template slot-scope="{ block, index }">
          <div class="actions">
            <a class="pr-1" @click="editBlock(block, index)">
              <i class="icon-edit"></i>
            </a>
            <a class="pr-1"  @click="page.blocks.splice(index,1)">
              <i class="icon-x"></i>
            </a>
          </div>
          <block-preview :block="block"
                         :namespace="namespace"
                         :module="module"></block-preview>
        </template>
      </grid>

      <b-modal id="createBlockSelector" hide-footer :title="$t('page.build.selectBlockTitle')">
        <new-block-selector :record-page="!!module" @select="editBlock($event)"/>
      </b-modal>

      <b-modal
        :title="$t('block.general.title')"
        :ok-title="$t('page.build.addBlock')"
        ok-variant="dark"
        ok-only
        @ok="updateBlocks"
        @hide="editor=null"
        :visible="showCreator">
        <block-edit v-if="showCreator"
                    :namespace="namespace"
                    :module="module"
                    :page="page"
                    :block.sync="editor.block" />
      </b-modal>

      <b-modal
        :title="$t('block.general.changeBlock')"
        :ok-title="$t('general.label.saveAndClose')"
        ok-variant="dark"
        ok-only
        centered
        @ok="updateBlocks"
        @hide="editor=null"
        :visible="showEditor">
        <block-edit v-if="showEditor"
                    :namespace="namespace"
                    :module="module"
                    :page="page"
                    :block.sync="editor.block" />
      </b-modal>

      <editor-toolbar :back-link="{name: 'admin.pages'}"
                      :hideDelete="!page.canDeletePage"
                      :hideSave="!page.canUpdatePage"
                      @save="handleSave()"
                      @saveAndClose="handleSave({ closeOnSuccess: true })">
        <b-button v-if="page.canUpdatePage" pill variant="outline-secondary" class="mr-1" v-b-modal.createBlockSelector>+ {{ $t('page.build.addBlock') }}</b-button>
        <b-button v-if="page.canUpdatePage" pill variant="outline-secondary" class="mr-1" @click.prevent="handleSave({ previewOnSuccess: true })">{{ $t('general.label.saveAndPreview') }}</b-button>
      </editor-toolbar>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import NewBlockSelector from '@/components/Admin/Page/Builder/Selector'
import Grid from '@/components/Common/Grid'
import Block from '@/lib/block'
import BlockPreview from '@/lib/block/BuilderPreview'
import BlockEdit from '@/lib/block/BuilderEdit'
import EditorToolbar from '@/components/Admin/EditorToolbar'
import Page from '@/lib/page'
import Namespace from '@/lib/namespace'

export default {
  components: {
    Grid,
    NewBlockSelector,
    BlockEdit,
    BlockPreview,
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
      this.page = new Page(page)
    })
  },

  methods: {
    ...mapActions({
      findPageByID: 'page/findByID',
      updatePage: 'page/update',
    }),

    editBlock (block, index = undefined) {
      this.editor = { index, block: new Block({ ...block }) }
    },

    updateBlocks () {
      let block = new Block(this.editor.block) // make sure we get rid of the references
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
        this.page = new Page({ namespaceID, ...page, blocks: this.page.blocks })

        this.updatePage(this.page).then((page) => {
          this.raiseSuccessAlert(this.$t('notification.page.saved'))
          if (closeOnSuccess) {
            this.$router.push({ name: 'admin.pages' })
          } else if (previewOnSuccess) {
            this.$router.push({ name: 'page' })
          }

          this.page = new Page(page)
        }).catch(this.defaultErrorHandler(this.$t('notification.page.saveFailed')))
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.builder {
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
}

.actions {
  position: sticky;
  z-index: 2;
  margin-bottom: -25px;

  a {
    &:hover {
      i {
        color: $black;
        opacity: 0.8;
      }
    }
  }
}

</style>
