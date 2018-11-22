<template>
    <header>
      <nav>
        <menu-level :pages="tree"></menu-level>
      </nav>
    </header>
</template>
<script>
import MenuLevel from './MenuLevel'
export default {
  data () {
    return {
      tree: [],
    }
  },

  created () {
    this.$crm.pageTree().then((result) => { this.tree = result })
  },

  components: {
    MenuLevel,
  },
}
</script>
