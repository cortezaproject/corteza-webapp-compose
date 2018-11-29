<template>
    <header>
      <b-navbar toggleable type="light" toggle-breakpoint="md">
          <b-navbar-toggle target="nav_text_collapse"></b-navbar-toggle>
          <b-collapse is-nav id="nav_text_collapse">
            <menu-level :pages="tree"></menu-level>
          </b-collapse>
      </b-navbar>
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

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";

nav {
  box-shadow: 0 0.1rem 0.2rem 0 rgba(30, 34, 36, 0.1);
}

.navbar {
  padding: 0;
}

.navbar-toggler {
  margin: 5px 5px 5px 10px;
  font-size: 12px;
  padding: 5px 10px;

  &:focus,
  &:hover {
    outline: none;
  }
}

@media (max-width: $wideminwidth) {
  .navbar-text {
    display: block;
  }
}

</style>
