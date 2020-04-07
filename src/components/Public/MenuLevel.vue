<template>
  <ul :class="ulClass">
    <li v-for="child in children"
        :key="child.pageID"
        :class="liClass(child)">
      <router-link :to="{ name: 'page', params: { pageID: child.pageID }}" class="nav-link">{{ child.title }}</router-link>
      <menu-level v-if="hasChildren(child)"
                  :pages="pages"
                  :level="level + 1"
                  :parentPageID="child.pageID"
                  :selectedPath="selectedPath"
                  :currentPageID="currentPageID" />
    </li>
   <slot name="collapse"></slot>
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

    parentPageID: {
      type: String,
      default () { return '0' },
    },

    currentPageID: {
      type: String,
    },
  },

  computed: {
    children () {
      return this.pages.filter(p => this.showInNav(p) && p.selfID === this.parentPageID) || []
    },

    ulClass () {
      const cc = {}
      cc.root = this.level === 0
      return cc
    },

    liClass () {
      return ({ pageID }) => {
        return {
          'selected-in-path': this.selectedPath.findIndex(p => p === pageID) > -1,
          selected: pageID === this.currentPageID,
        }
      }
    },
  },

  methods: {
    /**
     * Page is visible ( when visible flag is true & it is not a record
     *
     * @param page
     * @returns {boolean}
     */
    showInNav (page) {
      return page.visible && !page.isRecordPage && page.blocks.length > 0
    },

    hasChildren ({ pageID }) {
      return !!this.pages.find(c => c.selfID === pageID && this.showInNav(c))
    },
  },
}
</script>
<style lang="scss" scoped>
/* stylelint-disable no-descending-specificity */

ul,li {
  padding: 0;
  margin: 0;
}

.nav-link {
  color: $navbar-color;

  &.router-link-active {
    color: $navbar-active-color;
    background-color: $navbar-active-bg;
  }

  &:hover {
    color: $navbar-hover-color;
  }
}

.selected,
.selected-in-path {
  border-bottom: 2px solid $navbar-active-border;
}

ul {
  white-space: nowrap;

  &.root {
    li {
      display: inline-block;

      a {
        padding: 14px;
      }
    }
  }

  &:not(.root) {
    background: $navbar-bg;

    ul:nth-child(2) {
      position: relative;
      left: 0;
      padding-left: 15px;
      box-shadow: none;
    }

    li {
      width: 100%;
      min-width: 150px;
      display: block;

      &.selected, &.selected-in-path {
        border-bottom: none;
      }

      :nth-child(2) {
        margin-top: 0;
      }
    }
  }

  li {
    position: relative;

    a, span {
      display: block;

      &::after {
        content: "";
        display: inline-block;
        margin-left: 10px;
        border-width: 4px;
        border-style: solid dashed dashed dashed;
        border-color: $secondary transparent transparent transparent;
      }

      &:only-child::after {
        border: none;
      }
    }

    & > ul {
      visibility: hidden;
      z-index: 2000;
      position: absolute;
      box-shadow: 0 0.1rem 0.2rem 0 rgba(30, 34, 36, 0.1);
    }

    &:hover > ul,
    &:hover > ul ul,
    &:active > ul,
    &:active > ul ul {
      visibility: visible;
      min-width: 100%;
    }
  }

  &:nth-child(2) {
    a {
      &::after {
        border-style: dashed dashed dashed solid;
        border-color: $secondary transparent transparent transparent;
        float: right;
        position: absolute;
        top: 12px;
        right: 5px;
      }
    }
  }
}

@media (max-width: 767px) {
  .nav-link.router-link-active {
    border-right: 3px solid $navbar-active-border;
    border-bottom: none;
    background-color: rgba($navbar-active-border, 0.15);
  }

  .selected {
    border-bottom: none;
  }

  ul {
    position: relative;

    &.root {
      border-right: 1px solid $light;
      max-width: 260px;
      overflow: hidden;

      li {
        display: block;
        visibility: visible;

        a {
          overflow: hidden;
          text-overflow: ellipsis;

          &::after {
            border: none;
          }
        }
      }
    }

    &:not(.root) {
      position: relative;
      padding-left: 15px;
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
