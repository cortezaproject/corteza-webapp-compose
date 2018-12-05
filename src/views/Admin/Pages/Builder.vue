<template>
  <div class="builder">
    <grid :blocks.sync="blocks" editable>
      <template slot-scope="{ block, index }">
        <div class="actions">
          <a class="action" @click="updateBlock=block">
            <i class="icon-edit"></i>
          </a>
          <a class="action"  @click="blocks.splice(index,1)">
            <i class="icon-x"></i>
          </a>
        </div>

        <block-preview :block="block"></block-preview>
      </template>
    </grid>

    <b-modal id="createBlockSelector" hide-footer>
      <new-block-selector @select="createBlock=Object.assign({}, $event);"/>
    </b-modal>

    <b-modal
      title="Add new block"
      ok-title="Add block"
      @ok="blocks.push(createBlock)"
      @hide="createBlock=null"
      :visible="!!createBlock">
      <block-edit v-if="createBlock" :moduleID="moduleID" :block.sync="createBlock" />
    </b-modal>

    <b-modal
      title="Change existing block"
      ok-title="Close"
      ok-only
      @hide="updateBlock=null"
      :visible="!!updateBlock">
      <block-edit v-if="updateBlock" :moduleID="moduleID" :block.sync="updateBlock" />
    </b-modal>

    <div class="toolbar">
      <button v-b-modal.createBlockSelector @click="createBlock=null" class="btn btn-dark large">+ Add block</button>
      <button @click.prevent="$router.push({ name: 'public.page', params: { pageID } })" class="btn btn-dark large">Preview</button>
      <button @click.prevent="handleSave" class="btn btn-dark large">Done (save layouts)</button>
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
      blocks: [],
      moduleID: null,
    }
  },

  mounted () {
    this.$crm.pageRead({ pageID: this.pageID }).then(page => {
      if (page.blocks && Array.isArray(page.blocks)) {
        this.blocks = page.blocks.map(b => new Block(b))
        this.moduleID = page.moduleID
      }
    })
  },

  methods: {
    handleSave () {
      this.$crm.pageRead({ pageID: this.pageID }).then(page => {
        page.blocks = this.blocks
        this.$crm.pageEdit(page)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/components/actions.scss";

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

.builder {
  margin-bottom: 80px;
}

.actions {
  position: absolute;
  right: 2px;
  top: 2px;

  a {
    i {
      font-weight: 900;
    }

    &:hover {
      i {
        color: $black;
        opacity: 0.8;
      }
    }

    &.action {
      padding: 0 5px;
    }
  }
}
</style>
