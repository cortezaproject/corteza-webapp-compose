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

    <b-modal id="createBlockSelector" hide-footer title="Select type of the new block">
      <new-block-selector :record-page="!!module" @select="createBlock=Object.assign({}, $event);"/>
    </b-modal>

    <b-modal
      title="Add new block"
      ok-title="Add block"
      @ok="blocks.push(createBlock)"
      @hide="createBlock=null"
      :visible="!!createBlock">
      <block-edit v-if="createBlock" :module="module" :page="page" :block.sync="createBlock" />
    </b-modal>

    <b-modal
      title="Change existing block"
      header-class="test"
      ok-title="Save and close"
      ok-variant="dark"
      ok-only
      centered
      @hide="updateBlock=null"
      :visible="!!updateBlock">
      <block-edit v-if="updateBlock" :module="module" :page="page" :block.sync="updateBlock" />
    </b-modal>

    <div class="toolbar">
      <button v-b-modal.createBlockSelector @click="createBlock=null" class="btn large">+ Add block</button>
      <button @click.prevent="$router.push({ name: 'public.page', params: { pageID } })" class="btn large">Preview</button>
      <button @click.prevent="handleSave()" class="btn btn-blue large">Save</button>
      <button @click.prevent="handleSave({ closeOnSucess: true })" class="btn btn-blue large">Save and close</button>
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

  data () {
    return {
      createBlock: null, // holds instance of a block we're adding
      updateBlock: null, // holds instance of a block we're editing
      blocks: [],
      page: null,
      module: null,
    }
  },

  mounted () {
    this.$crm.pageRead({ pageID: this.pageID }).then(page => {
      this.page = page
      if (page.moduleID !== '0') {
        console.log(page.moduleID)
        this.$crm.moduleRead({ moduleID: page.moduleID }).then(m => {
          console.log(m)
          this.module = m
        })
      }

      if (page.blocks && Array.isArray(page.blocks)) {
        this.blocks = page.blocks.map(b => new Block(b))
      }
    })
  },

  methods: {
    handleSave ({ closeOnSucess = false } = {}) {
      this.$crm.pageRead({ pageID: this.pageID }).then(page => {
        page.blocks = this.blocks
        this.$crm.pageEdit(page)

        if (closeOnSucess) {
          this.$router.push({ name: 'admin.pages' })
        }
      })
    },
  },

  components: {
    Grid,
    NewBlockSelector,
    BlockEdit,
    BlockPreview,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

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

.btn {
  margin: 0 auto;
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
