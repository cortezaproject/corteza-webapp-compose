<template>
  <ul :class="ulClass">
    <li v-for="page in pages" :key="page.id" v-if="page.visible">
      <router-link :to="{ name: 'public.page', params: { pageID: page.id }}">{{ page.title }}</router-link>
      <menu-level :pages="page.children" v-if="hasVisibleChildren(page)" level="level + 1"></menu-level>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'menu-level',
  props: {
    pages: {
      type: Array,
      required: true,
    },

    level: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    ulClass () {
      let cc = {}
      cc['root'] = this.level === 0
      return cc
    },
  },

  methods: {
    hasVisibleChildren (p) {
      return p.children && p.children.filter(p => p.visible).length > 0
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";

// General styling
ul,li {
  padding: 0;
  margin: 0;
}

// Root level styling
ul.root {
  li {
    display: inline-block;
    margin: 3px 20px;
  }
}

ul:not(.root) {
  li {
    min-width: 100px;
    display: block;
  }
}

// Opening
/* stylelint-disable-next-line */
li {
  /* stylelint-disable-next-line */
  & > ul {
    margin: 0 0 0 0;
    padding: 0;
    display: none;
    background-color: $appcream;
    z-index: 10;
    position: absolute;
    border: 1px solid white;
  }

  &:hover > ul,
  &:active > ul {
    display: block;
  }
}
</style>
