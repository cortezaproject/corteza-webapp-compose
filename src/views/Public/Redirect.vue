<template>
  <div class="container">
    <div style="color:red;">
      {{listError}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublicRedirect',
  data () {
    return {
      listError: '',
    }
  },
  async created () {
    // --- B --- redirect to pages/{pageId}
    try {
      // List pages without module
      const json = (await this.$crm.pageList({})).filter(page => !page.module)
      if (json.length > 0) {
        this.$router.push({ path: '/pages/' + json[0].id })
      } else {
        this.listError = 'No pages foud'
      }
    } catch (e) {
      this.listError = 'Error when trying to get list of pages.'
    }
    // --- E --- redirect to pages/{pageId}
  },
}
</script>
<style lang="scss" scoped>
</style>
