<template>
  <div class="view-grid">
    <grid-layout :layout="blocks" :col-num="colNum" :is-draggable="false" :is-resizable="false" :vertical-compact="true" :use-css-transforms="true">
      <grid-item v-for="item in blocks" v-bind:key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" v-bind:is-draggable="false">
        <div class="page-data">
          <div class="page-data__title">{{ item.data.title }}</div>
          <p class="page-data__description">{{ item.data.description }}</p>
          <div class="page-data__content">
            <i>TEMPORARY : always same fields here. TODO => get fields from block</i>
            <div class="page-data__content-fields">
              <form>
                <fieldset class="form-group">
                  <div class="form-group">
                    <label for="title">Name</label>
                    <input type="text" class="form-control form-control-sm" id="title" placeholder="Block Title">
                  </div>
                  <div class="form-group">
                    <label for="description">Tel</label>
                    <input type="text" class="form-control form-control-sm" id="description" placeholder="Block Description">
                  </div>
                </fieldset>
                <fieldset class="form-group">
                </fieldset>
                <fieldset class="form-group">
                  <button type="submit" class="btn btn-primary">Submit</button>
                </fieldset>
              </form>
            </div>
          </div>
          <div class="page-data__footer">
            <p>{{ item.data.footer }}</p>
          </div>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
/* eslint-disable-next-line */
import VueGridLayout from "vue-grid-layout";
export default {
  name: 'PageView',
  created () {
    this.$store.dispatch('pages/initViewPageData', this.$route.params.id)
  },
  computed: {
    ...mapState({
      blocks: state => state.pages.viewPageData.blocks,
      colNum: state => 2,
      initViewPageDataError: state => state.pages.initViewPageDataError,
      viewPageData: state => state.pages.viewPageData,
    }),
  },
  methods: {
    ...mapActions('pages', []),
  },
}
</script>
<style lang="scss" scoped>
@import "src/assets/styles/shared";

.view-grid {
  width: 100%;
  &.mobile {
    width: 320px;
    margin: 0 auto;
  }
  .vue-grid-item {
    border: 1px solid #ccc;
    padding: 10px;
  }
  .page-data {
    .page-data__title {
      font-size: 15px;
    }
    .page-data__description {
      font-size: 10px;
      border-bottom: 1px solid black;
    }
    .page-data__content {
      fieldset {
        border: none;
      }
    }
    .page-data__footer {
      font-size: 10px;
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
