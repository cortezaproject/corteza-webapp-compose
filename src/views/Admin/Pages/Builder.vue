<template>
  <div class="builder">
    <grid :blocks.sync="blocks" editable>
      <template slot-scope="{ block, index }">
        <div class="actions">
          <button @click="updateBlock=block">Edit</button>
          <button @click="blocks.splice(index,1)">X</button>
        </div>

        <block-preview :block="block"></block-preview>
      </template>
    </grid>

    <b-modal id="createBlockSelector" hide-footer>
      <new-block-selector @select="createBlock=$event;"/>
    </b-modal>

    <b-modal
      title="Add new block"
      ok-title="Add block"
      @ok="blocks.push(createBlock)"
      @hide="createBlock=null"
      :visible="!!createBlock">
      <block-edit v-if="createBlock" :pageModuleID="pageModuleID" :block.sync="createBlock" />
    </b-modal>

    <b-modal
      title="Change existing block"
      ok-title="Close"
      ok-only
      @hide="updateBlock=null"
      :visible="!!updateBlock">
      <block-edit v-if="updateBlock" :pageModuleID="pageModuleID" :block="updateBlock" />
    </b-modal>

    <div class="toolbar">
      <button v-b-modal.createBlockSelector @click="createBlock=null">Add block</button>
      <button @click.prevent="$router.push({ name: 'public.page', params: { pageID } })">Preview</button>
      <button @click.prevent="handleSave">Done (save layouts)</button>
    </div>
  </div>
</template>

<script>
import NewBlockSelector from '@/components/Admin/Page/Builder/Selector'
import Grid from '@/components/Common/Grid'
import Block from '@/lib/block'
import BlockPreview from '@/lib/block/BuilderPreview'
import BlockEdit from '@/lib/block/BuilderEdit'

export default {
  props: {
    pageID: {
      type: String,
      required: true,
    },
  },

  components: {
    Grid,
    NewBlockSelector,
    BlockEdit,
    BlockPreview,
  },

  data () {
    return {
      createBlock: null, // holds instance of a block we're adding
      updateBlock: null, // holds instance of a block we're editing
      pageModuleID: 0,

      blocks: [],
    }
  },

  mounted () {
    this.$crm.pageRead({ pageID: this.pageID }).then(page => {
      this.pageModuleID = page.moduleID
      if (page.blocks && Array.isArray(page.blocks)) {
        this.blocks = page.blocks.map(b => new Block(b))
      }
    })
  },

  methods: {
    handleSave () {
      this.$crm.pageRead({ pageID: this.pageID }).then(page => {
        page.blocks = this.blocks
        this.page = page
        this.$crm.pageEdit(page).then({})
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";

.toolbar {
  position: fixed;
  background-color: $appwhite;
  border-top: 1px solid $appgrey;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;

  button {
    margin-right: 10px;
  }
}

.actions {
  button {
    font-size: 60%;
  }

  position: absolute;
  right: 2px;
  top: 0;
}
</style>
