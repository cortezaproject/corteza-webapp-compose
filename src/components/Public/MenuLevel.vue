<template>
  <ul :class="ulClass">
    <li v-for="child in children"
        :key="child.pageID"
        v-if="showInNav(child)"
        :class="liClass(child)">
      <router-link :to="{ name: 'public.page', params: { pageID: child.pageID }}" class="nav-link">{{ child.title }}</router-link>
      <menu-level v-if="hasChildren(child)"
                  :pages="pages"
                  :level="level + 1"
                  :parentPageID="child.pageID"
                  :selectedPath="selectedPath"
                  :currentPageID="currentPageID" />
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

    parentPageID: {
      type: String,
    },

    currentPageID: {
      type: String,
    },
  },

  computed: {
    children () {
      return this.pages.filter(p => this.showInNav(p) && p.selfID === (this.parentPageID || null)) || []
    },

    ulClass () {
      let cc = {}
      cc['root'] = this.level === 0
      return cc
    },

    liClass () {
      return ({ pageID }) => {
        return {
          'selected-in-path': this.selectedPath.findIndex(p => p === pageID) > -1,
          'selected': pageID === this.currentPageID,
        }
      }
    },
  },

  methods: {
    // Page is visible ( when visible flag is true & it is not a record
    showInNav (page) {
      return page.visible && !page.moduleID && page.blocks.length > 0
    },

    hasChildren ({ pageID }) {
      return !!this.pages.find(c => c.selfID === pageID && this.showInNav(c))
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
      box-shadow: 0 0.1rem 0.2rem 0 rgba(30, 34, 36, 0.1);
    }

    &:hover > ul,
    &:active > ul {
      display: block;
      min-width: 100%;
    }
  }

  &:nth-child(2) {
    a {
      &::after {
        border-style: dashed dashed dashed solid;
        border-color: transparent transparent transparent $appgrey;
        float: right;
        position: absolute;
        top: 12px;
        right: 5px;
      }
    }
  }
}

@media (max-width: 991px) {
  ul {
    position: relative;

    &.root {
      border-right: 1px solid $appcream;
      max-width: 250px;
      overflow: hidden;

      li {
        display: block;

        a {
          padding: 7px 10px;
          font-size: 14px;
          line-height: 20px;
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
