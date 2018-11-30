<template>
    <header>
      <b-navbar toggleable type="light" toggle-breakpoint="md">
          <b-navbar-toggle target="nav_text_collapse"></b-navbar-toggle>
          <b-collapse is-nav id="nav_text_collapse">
            <menu-level :pages="tree" :selectedPath="selectedPath" :pageID="pageID"></menu-level>
            <router-link :to="{ name: 'admin' }" class="nav-link admin-panel">Admin panel</router-link>
          </b-collapse>
      </b-navbar>
    </header>
</template>
<script>
import MenuLevel from './MenuLevel'

export default {
  props: {
    pageID: {
      type: String,
    },
  },

  data () {
    return {
      tree: [],
    }
  },

  computed: {
    selectedPath () {
      const tt = (pp, pageID) => {
        if (!pp) {
          return false
        }

        for (let i = 0; i < pp.length; i++) {
          if (pp[i].pageID === pageID) {
            return [pageID]
          }

          let path = tt(pp[i].children, pageID)
          if (path) {
            path.unshift(pp[i].pageID)
            return path
          }
        }

        return false
      }

      return tt(this.tree, this.pageID) || []
    },
  },

  created () {
    this.$crm.pageTree().then((result) => { this.tree = result })
  },

  methods: {
    findActive (pp, pageID) {
      if (!pp) {
        return false
      }

      for (let i = 0; i < pp.length; i++) {
        if (pp[i].pageID === pageID) {
          return [pageID]
        }

        let path = this.findActive(pp[i].children, pageID)
        if (path) {
          path.unshift(pp[i].pageID)
          return path
        }
      }

      return false
    },
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

.admin-panel {
  position: absolute;
  right: 0;
  color: $black;
}

@media (max-width: $wideminwidth) {
  .navbar-text {
    display: block;
  }

  .admin-panel {
    position: relative;
    padding-left: 20px;
  }
}

</style>
