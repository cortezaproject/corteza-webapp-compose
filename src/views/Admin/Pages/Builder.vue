<template>
    <div class="builder">
        <!--<BlockSelector :page-data=pageData :block-to-edit=blockToEdit v-on:addNewBlock="addNewBlock" v-on:blockHasBeenEdited="blockHasBeenEdited"></BlockSelector>-->
        <!--<DoneButton :layout=layout v-on:saved="saveButtonClicked"></DoneButton>-->
        <builder-grid :blocks.sync="blocks" />

        <b-modal id="newBlockSelector" hide-footer>
            <new-block-selector @select="newBlock=$event;" />
        </b-modal>

        <b-modal
                title="Add new block"
                ok-title="Add block"
                :visible="!!newBlock"
                @ok="blocks.push(newBlock)"
                @hide="newBlock=null">
            <block-editor v-if="newBlock" :block.sync="newBlock" />
        </b-modal>

        <div class="toolbar">
            <button v-b-modal.newBlockSelector @click="newBlock=null">Add block</button>
            <button @click.prevent="handleSave">Done (save layouts)</button>
        </div>
    </div>
</template>

<script>
import NewBlockSelector from '@/components/builder/Block'
import BlockEditor from '@/components/builder/Block/Editor'
import BuilderGrid from '@/components/builder/BuilderGrid'
import Block from '@/lib/block'

export default {
  props: {
    pageID: {
      type: String,
      required: true,
    },
  },

  components: {
    BuilderGrid,
    NewBlockSelector,
    BlockEditor,
  },

  data () {
    return {
      // isNewBlockEditorOpen: false,
      newBlock: null,
      blocks: [],

      loaded: true,
    }
  },

  mounted () {
    this.$crm.pageRead({ 'pageID': this.pageID }).then(page => {
      if (page.blocks && Array.isArray(page.blocks)) {
        this.blocks = page.blocks.map(b => new Block(b))
      }
    })
  },

  methods: {
    handleSave () {
      this.$crm.pageRead({ 'pageID': this.pageID }).then((page) => {
        page.blocks = this.blocks
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
</style>
