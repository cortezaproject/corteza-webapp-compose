<template>
  <div class="nav-sidebar">
    <b-btn
      v-for="(i) of items"
      :key="i.page.pageID"
      variant="link"
      class="w-100 text-left text-dark text-decoration-none pt-2 pb-0 nav-item"
      exact-active-class="nav-active"
      :to="{ name: 'page', params: { pageID: i.page.pageID }}"
      @click="$emit('page-selected')"
    >
      <span class="d-inline-block w-75 text-nowrap text-truncate">
        {{ i.page.title }}
      </span>

      <template
        v-if="i.children.length"
      >
        <b-btn
          variant="link"
          class="px-3 float-right mt-n1"
          @click.self.stop.prevent="toggle(i.page)"
        >
          <font-awesome-icon v-if="!collapses[pageIndex(i.page)]"
                             class="pointer-none"
                             :icon="['fas', 'chevron-down']" />
          <font-awesome-icon v-else
                             class="pointer-none"
                             :icon="['fas', 'chevron-up']" />
        </b-btn>
        <b-collapse
          :visible="collapses[pageIndex(i.page)]"
          @click.stop.prevent
        >
          <sidebar-nav-item
            class="ml-2"
            :items="i.children"
            :start-expanded="startExpanded"
            v-on="$listeners"
          />
        </b-collapse>
      </template>
    </b-btn>
  </div>
</template>

<script>
export default {
  name: 'sidebar-nav-item',

  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    startExpanded: {
      type: Boolean,
      required: false,
    },
    topLevel: {
      type: Boolean,
      required: false,
    },
  },

  data () {
    return {
      collapses: {},
    }
  },

  watch: {
    items: {
      handler: function (items) {
        for (const i of items) {
          this.setState(i.page, this.startExpanded)
        }
      },
      immediate: true,
    },
  },

  methods: {
    pageIndex (p) {
      return p.pageID || p.pageHandle || p.pageTitle
    },

    toggle (p) {
      const px = this.pageIndex(p)
      this.$set(this.collapses, px, !this.collapses[px])
    },

    setState (p, state = false) {
      const px = this.pageIndex(p)
      this.$set(this.collapses, px, state)
    },
  },
}
</script>
<style scoped lang="scss">
// This has to be there, so chevrons are clickable inside the button
.pointer-none {
  pointer-events: none;
}

// Using font-weight-bold moves the sidebar nav content; text-stroke keeps in nicely in place
.nav-active > span {
  -webkit-text-stroke: 1px black;
}
</style>
