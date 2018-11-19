<template>
  <PageContent :layout=layout></PageContent>
</template>

<script>
/* eslint-disable-next-line */
import VueGridLayout from 'vue-grid-layout'
import PageContent from '@/components/PageContent'

import SharedService from '@/services/SharedService'

export default {
  name: 'PageView',
  components: {
    PageContent,
  },
  data () {
    return {
      pageData: {},
      layout: [],
    }
  },
  created () {
    this.fetchPage()
  },
  methods: {
    async fetchPage () {
      // await this.$store.dispatch('builder/fetchPageData', this.$route.query.pageId)
      this.pageData = await this.$root.$crm.pageRead({
        pageID: this.$route.params.id,
      })

      if (this.pageData.id === '0') {
        throw new Error('No id')
      }

      // check if there are any blocks to add
      if (this.pageData.blocks && this.pageData.blocks.length > 0) {
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
      } else {
        this.layout = []
      }
    },
  },
}
</script>
