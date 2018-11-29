<template>
  <ul :class="ulClass">
    <li v-for="page in pages" :key="page.pageID" v-if="page.visible">
      <router-link :to="{ name: 'public.page', params: { pageID: page.pageID }}">{{ page.title }}</router-link>
      <menu-level :pages="page.children" v-if="hasVisibleChildren(page)" :level="level + 1"></menu-level>
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

ul,li {
  padding: 0;
  margin: 0;
}

ul {
  font-size: 15px;
  white-space: nowrap;

  &.root {
    li {
      display: inline-block;
      cursor: pointer;

      a {
        padding: 10px 20px;
      }
    }
  }

  &:not(.root) {
    background: #fff;

    ul:nth-child(2) {
      left: 100%;
      top: 0;
    }

    li {
      width: 100%;
      min-width: 150px;
      display: block;

      a {
        padding: 5px 20px;
      }

      :nth-child(2) {
        margin-top: 0;
      }
    }
  }

  li {
    position: relative;

    a {
      color: $black;
      display: block;

      &::after {
        content: "";
        float: right;
        position: absolute;
        bottom: 15px;
        right: 5px;
        border-width: 4px;
        border-style: solid dashed dashed dashed;
        border-color: $appgrey transparent transparent transparent;
      }

      &:only-child::after {
        border: none;
      }
    }

    & > ul {
      margin-top: 3px;
      display: none;
      background-color: $appcream;
      z-index: 10;
      position: absolute;
      box-shadow: 0 0 0.2rem 0 rgba(30, 34, 36, 0.1);
    }

    &:hover > ul,
    &:active > ul {
      display: block;
      min-width: 100%;
    }
  }

  &:nth-child(2) {
    margin-top: 0;

    a {
      &::after {
        border-style: dashed dashed dashed solid;
        border-color: transparent transparent transparent $appgrey;
      }
    }
  }
}

</style>
