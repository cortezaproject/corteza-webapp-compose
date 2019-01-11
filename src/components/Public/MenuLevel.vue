<template>
  <ul :class="ulClass">
    <li v-for="page in pages" :key="page.pageID" v-if="showInNav(page)" :class="{ 'selected-in-path': -1 < selectedPath.findIndex(p => p === page.pageID), 'selected': page.pageID === pageID }">
      <router-link :to="{ name: 'public.page', params: { pageID: page.pageID }}" class="nav-link">{{ page.title }}</router-link>
      <menu-level
        :pages="page.children" v-if="hasVisibleChildren(page)"
        :level="level + 1"
        :selectedPath="selectedPath"
        :pageID="pageID" />
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

    selectedPath: {
      type: Array,
      default () { return [] },
    },

    pageID: {
      type: String,
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
      return p.children && p.children.filter(p => this.showInNav(p)).length > 0
    },

    // Page is visible ( when visible flag is true & it is not a record
    showInNav (p) {
      return p.visible && p.moduleID === '0' && p.blocks.length > 0
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
/* stylelint-disable no-descending-specificity */

ul,li {
  padding: 0;
  margin: 0;
}

.nav-link {
  color: $black;
}

.selected, .selected-in-path {
  text-decoration: none;
  border-bottom: 2px solid $appblue;
}

.selected {
  & > a {
    color: $appblue;
  }
}

ul {
  font-size: 15px;
  white-space: nowrap;

  &.root {
    max-width: calc(100vw - 120px);

    li {
      display: inline-block;
      cursor: pointer;

      a {
        padding: 13px 15px;

        &:hover {
          color: $appblue;
        }
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

      &.selected, &.selected-in-path {
        border-bottom: none;
      }

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
      display: block;

      &::after {
        content: "";
        display: inline-block;
        margin-left: 10px;
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
        float: right;
        position: absolute;
        bottom: 15px;
        right: 5px;
      }
    }
  }
}

@media (max-width: $wideminwidth) {
  ul {
    position: relative;

    &.root {
      li {
        display: block;

        a {
          padding: 10px 15px;
        }
      }
    }

    &:not(.root) {
      position: relative;
      padding-left: 25px;
      box-shadow: none;

      ul:nth-child(2) {
        left: 0;
      }
    }

    li {
      & > ul {
        display: block;
      }
    }
  }
}

</style>
