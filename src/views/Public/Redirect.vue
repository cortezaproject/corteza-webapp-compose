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

  beforeMount () {
    this.$crm.pageList({}).then((pp) => {
      pp = pp.filter(p => p.moduleID === '0' && p.visible)
      if (pp.length > 0) {
        this.$router.push({ name: 'public.page', params: { pageID: pp[0].pageID } })
      } else {
        this.listError = 'No pages found'
      }
    }).catch(() => {
      this.listError = 'Unable to fetch pages'
    })
  },
}
</script>
