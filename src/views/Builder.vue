<template>
  <div class="builder" v-if="loaded">

    <BlockSelector :page-data=pageData :block-to-edit=blockToEdit v-on:addNewBlock="addNewBlock" v-on:blockHasBeenEdited="blockHasBeenEdited"></BlockSelector>
    <DoneButton :layout=layout v-on:saved="saveButtonClicked"></DoneButton>
    <BuilderGrid :layout=layout v-on:editBlock="editBlock"></BuilderGrid>

  </div>
</template>

<script>
import BlockSelector from '@/components/builder/BlockSelector'
import BuilderGrid from '@/components/builder/BuilderGrid'
import DoneButton from '@/components/builder/DoneButton'

import SharedService from '@/services/SharedService'

export default {
  components: {
    BlockSelector,
    DoneButton,
    BuilderGrid,
  },
  data () {
    return {
      loaded: true,
      modules: [],
      result: {},
      pageData: {},
      selectedModules: [],
      selectedFields: [],
      blockDefaults: {
        x: 0,
        w: 1,
        h: 1,
        y: 0,
        colNum: 2,
      },
      addBlockFormData: {},
      addBlockFormMeta: {},
      addBlockFormContent: {
        fields: [],
        listBuilder: {
          module: null,
          fields: [],
        },
      },
      layout: [],
      layoutTemp: [],
      layoutMobile: [],
      block: null,
      blockToEdit: null,
    }
  },
  created () {
    this.fetchPage()
  },
  methods: {
    async fetchPage () {
      // await this.$store.dispatch('builder/fetchPageData', this.$route.query.pageId)
      this.pageData = await this.$root.$crm.pageRead({ 'pageID': this.$route.query.pageId })

      // check if there are any blocks to add
      if (this.pageData.blocks) {
        this.layout = SharedService.cloneObject(this.pageData.blocks)

        // rebuild the fields that have been added
        this.layout.forEach(function (block, blockInder) {
          block.content.fields = []

          // go through all fields (if any)
          if (block.content.fieldsID) {
            block.content.fields = []
            block.content.fieldsID.forEach(function (field, fieldIndex) {
              // find the corrosponding field in the module
              var f = block.content.module.fields.find(x => x.id === field)
              if (f) {
                // we found the field so copy it to the content.fields array
                block.content.fields.push(SharedService.cloneObject(f))
              } else {
                // the field was not found. Maybe the module has changed?
                alert(`Column ID ${field} in block not found`)
              }
            })
          }
        })
      }
    },
    addNewBlock (value) {
      // if not required then we can remove the below push
      this.selectedModules.push(value.selectedModule)

      // add block to the page grid
      const i = SharedService.generateUniqID()
      const x = this.blockDefaults.x
      var y = this.blockDefaults.y
      var w = this.blockDefaults.w
      const h = this.blockDefaults.h
      const data = SharedService.cloneObject(value.addBlockFormData)
      const meta = SharedService.cloneObject(value.addBlockFormMeta)
      const content = SharedService.cloneObject(value.content)
      const blockType = SharedService.cloneObject(value.blockType)

      if (meta.fixed) {
        y = 0
        w = 2
      }

      this.layout.push({
        i,
        x,
        y,
        w,
        h,
        data,
        meta,
        blockType,
        content,
      })
    },
    editBlock (value) {
      this.blockToEdit = value.blockToEdit
    },
    blockHasBeenEdited (value) {
      // find the block in the layout
      var i = 0
      for (i; i < this.layout.length; i++) {
        if (this.layout[i].i === value.editedBlock.i) {
          break
        }
      }

      // replace the block
      this.layout[i] = value.editedBlock

      // set to null to clear the watcher in the child component
      this.blockToEdit = null
    },
    async saveButtonClicked (vallue) {
      // api format for blocks : set only the id and not the objects entirely
      var pageBlocks = SharedService.cloneObject(this.layout)
      pageBlocks.forEach((block) => {
        if (block.content.listBuilder) {
          block.content.list = {}
          if (block.content.listBuilder.fields) {
            block.content.list.fieldsID = block.content.listBuilder.fields.map(field => field.id)
          }
          if (block.content.listBuilder.module) {
            block.content.list.moduleID = block.content.listBuilder.module.id
          }
          delete block.content.listBuilder
        }
        if (block.content.fields) {
          block.content.fieldsID = block.content.fields.map(field => field.id)
          delete block.content.fields
        }
      })

      await this.$root.$crm.pageEdit({
        pageID: this.pageData.id,
        selfID: this.pageData.selfID,
        moduleID: this.pageData.module ? this.pageData.module.id : null,
        title: this.pageData.title,
        description: this.pageData.description,
        visible: this.pageData.visible,
        blocks: pageBlocks,
      })

      alert('Page Layout Saved!')
    },
  },
}
</script>

<style lang="scss" scoped>
.builder {
  display: flex;
}
</style>
