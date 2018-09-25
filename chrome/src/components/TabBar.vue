<template>
  <div
    class="tab_list_wrapper"
    :style="(top === ''?'':'top:' + top) + ';' + (left ==='' ? '' : 'left:calc('+left+' - 5px)')">
    <draggable
      v-model="tabs"
      :options="{ group:'tabs' }"
      class="tab_list"
      @start="drag=true"
      @end="drag=true">
      <div
        class="tab_item item"
        :class="[ { active : active_tab === tab.id } ]"
        v-for="(tab, index) in tabs" :key="index"
        @touch="switchActive({id:tab.id, pane:pane_id})"
        @mousedown="switchActive({id:tab.id, pane:pane_id})">
        <span>{{ tab.title }}</span>
        <i class="icon-close"></i>
      </div>
    </draggable>
    <div class="tab-plus add">
      <label for="show-apps"><span  arial-label="Add tab" title="Add tab">+</span></label>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'TabBar',
  components:
  {
    draggable,
  },
  props: {
    showapps: {
      required: true,
      type: Boolean,
    },
    pane_id: {
      required: true,
      type: Number,
    },
    top:
    {
      required: false,
      type: String,
      default: '',
    },
    left:
    {
      required: false,
      type: String,
      default: '',
    },
    tabs: {
      required: true,
      type: Array,
    },
    active_tab:
    {
      type: Number,
      required: false,
      default: 0,
    },
  },
  methods:
  {
    switchActive: function (newActiveTab) {
      // console.log('newActiveTab ' + newActiveTab.id + ' in pane ' + newActiveTab.pane)
      this.$emit('changeActive', newActiveTab)
    },
  },
  data () {
    return {

    }
  },
}
</script>
<style scoped lang="scss">
  //define vars here
  $wideminwidth:640px;
  //import global variables (may overwrite previous ones)
  @import '@/assets/sass/_0.declare.scss';

  .tab_list_wrapper
  {
    font-family:$crustregular;
    height:0;
    position:fixed;
    bottom:-100vh;
    left:0;
    right:0;
    background-color:$tabbgcolor;
    transition: all 0.5s ease;
    z-index:3;
  }

  .tab_title
  {
    display:none;
  }
  //tab list is hidden by default.
  //for no we will use media query (below)
  //to display it
  .tab_list
  {
    display:none;
  }
  //style items even if hidden
  .tab_title
  {
    padding:1.5rem;
    color:$tabtitletxtcolor;
    font-size:1.8rem;
  }

  .tab_list
  {
    margin:1.5rem;
    padding:0;
    list-style:none;
  }

  .tab_item
  {
    padding:1.5rem;
    background-color:rgba($defaultlinecolor,0.15);
    border-radius:3px;
    margin-bottom:1rem;
    color:$tabitemtxtcolor;
    font-size:1.4rem;
    .icon-close
    {
      float:right;
      padding: 1.5rem;
      margin: -1.5rem;
    }
  }
  .tab_current_item
  {
    background-color:$tabcurrentbgcolor;
  }
  .tab-closer
  {
    [class*=icon]
    {
      color:$tabitemtxtcolor;
    }
  }

  //tab counter when folded.
  .tab_count
  {
    line-height:1;
    position:absolute;
    top:3rem;
    left:2rem;
  }
  //red dot on tab opener
  .tab-notification,
  .tab-opener-notification
  {
    &:after
    {
      display:inline-block;
      border-radius:100%;
      content:"";
      background-color:$notificationcolor;
      height:1rem;
      width:1rem;
      font-size:1;
      color:$headerbgcolor;
    }
  }
  .tab-opener-notification
  {
    &:after
    {
      position:absolute;
      top:0;
      right:0;
      border:solid 2px $headerbgcolor;
    }
  }
  //this is the label to show tabs in reponsive mode
  .tab_display
  {
    position:fixed;
    width:5.6rem;
    height:5.6rem;
    background-color:$defaultlinecolor;
    color:$tabitemtxtcolor;
    right:1.5rem;
    bottom:2rem;
    border-radius:100%;
    line-height:5.6rem;
    display:block;
    text-align:center;
  }
  .tab_bg
  {
    position:absolute;
    height:3.6rem;
    width:3.6rem;
    font-size:3.6rem;
    left:1rem;
    top:1rem;
    color:$tabitemtxtcolor;
  }
  //this is the display switched
  .tab_list_wrapper.displayed
  {
    height:calc(100% - 6rem);
    display:block;
    z-index:3;
    bottom:0;
    .tab_title,
    .tab_list
    {
      display:block;
    }
  }

  //using media query to change behaviour if available display area is sufficient.
  @media (min-width: $wideminwidth)
  {
    // browser like tabs
    // extended from Adem ilter @ademilter
    .tab_list_wrapper
    {
      background:none;
      position:absolute;
      //this should be replaced by value from props
      top:0;
      margin:0;
      padding:0;
      height:30px;
      bottom:auto;
    }

    .tab_title,
    .tab_display
    {
      display:none!important;
    }

    .tab-wrapper
    {
      min-height:100vh;
      padding-top: 9rem;
    }

    .tab_list {
      position:relative;
      float: left;
      margin:0;
      margin-left: 20px;
      height: 40px;
      background-color:transparent;
      display:block;
      //position:absolute;
      //top:0;
    }

    .tab_list .item,
    .tab_list .item:before {
      cursor: pointer;
      z-index: 1;
      position: relative;
      border: 1px solid #aaa;
      border-top: 0;
      transform: skewX(-25deg);
      float: left;
      margin: 0 0 0 7px;
      padding: 0 15px;
      width: 9vw;
      border-radius: 0 0 5px 5px;
      box-shadow: inset -1px 1px 0 rgba(255,255,255,.5);
      background: $tab_bgcolor;
      color:$defaulttextcolor;
      font-size:14px;
    }

    .tab_list .item
    {
      height: 29px;
    }
    .tab_list .item:before
    {
      height: 30px;
    }

    .tab_list .item:nth-child(1) { z-index: 9 }
    .tab_list .item:nth-child(2) { z-index: 8 }
    .tab_list .item:nth-child(3) { z-index: 7 }
    .tab_list .item:nth-child(4) { z-index: 6 }
    .tab_list .item:nth-child(5) { z-index: 5 }
    .tab_list .item:nth-child(6) { z-index: 4 }
    .tab_list .item:nth-child(7) { z-index: 3 }
    .tab_list .item:nth-child(8) { z-index: 2 }
    .tab_list .item:nth-child(9) { z-index: 1 }

    .tab_list .item.active,
    .tab_list .item.active:before {
      z-index: 999 !important;
      //background: #eee;
      height: 31px;
      border-color: #888;
      background-color:$curtab_bgcolor;
    }
    .tab_list .item:before
    {
      content: '';
      position: absolute;
      left: -18px;
      transform: skewX(-140deg);
      border-right: 0;
      margin: 0;
      padding: 0;
      width: 18px;
      border-radius:  0  0 0 5px;
      box-shadow: inset 1px 1px 0 rgba(255,255,255,.5);
      margin-top:-1px;
    }
    .tab_list .item img
    {
      z-index: 9;
      position: absolute;
      left: -6px;
      top: 6px;
      width: 16px;
      height: 16px;
      transform: skewX(25deg);
      border-radius: 3px;
    }

    .tab_list .item
    {
      a, em, .icon-close:before
      {
        transform: skewX(25deg);
      }

      .icon-close:before
      {
        border-radius:100%;
      }

      .icon-close:hover:before
      {
        background-color: #1E2224;
        color: $tab_hovercolor;
      }
      .icon-close:before, em
      {
        position:absolute;
        top:7px;
        right:12px;
        padding:0;
        margin:0;
      }

      .icon-close
      {
        margin: -3rem -1.5rem;
      }

      &.updated
      {
        > span
        {
          padding-left:18px;
        }
      }

      em
      {
        top:5px;
        z-index:4;
        right:auto;
        left:0px;
      }

      em
      {
        &:after
        {
          height:0.6rem;
          width:0.6rem;
        }
      }

      a
      {
        z-index: 3;
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 18px;
        color: #777;
        width: 15px;
        height: 15px;
        line-height: 16px;
        text-align: center;
        border-radius: 100%;
      }
    }
    .tab_list .item a:hover
    {
      color: $defaulttextcolor;
      background-color: #e05d68;
      box-shadow: inset 0 1px 1px rgba(0,0,0,.4);
    }

    .tab_list .item a:active
    {
      background-color: #d83240
    }

    .tab_list .item > span
    {
      display: block;
      width: calc(85% + 20px);
      line-height: 28px;
      transform: skewX(25deg);
      white-space: nowrap;
      overflow: hidden;
      text-overflow:ellipsis;
      background: $tab_bgcolor;
      padding-left:8px;
      margin-left:-20px;
    }
    .tab_list .item.active,
    .tab_list .item.active:before,
    .tab_list .item.active span
    {
      border-top:solid 1px $curtab_topbordercolor;
    }

    .tab_list .item.active
    {
      height:31px;
      span
      {
        margin-top:-1px;
        background-color:$curtab_bgcolor;
      }
    }

    // add tab
    .tab_list_wrapper
    {
      .add {
        cursor:pointer;
        text-align: center;
        font-weight: bold;
        color: #ccc;
        line-height: 15px;
        font-size: 15px;
        float: left;
        margin: 6px 8px 0;
        width: 23px;
        height: 16px;
        background: $tab_bgcolor;
        border-radius: 5px;
        border: 1px solid #aaa;
        transform: skewX(-25deg);
        //box-shadow: inset 0 1px 0 rgba(255,255,255,.8);
        span
        {
          display:block;
          transform: skewX(25deg);
          color:rgba(0,0,0,.8);
        }
      }

      .add:hover {
        background-color: #1E2224;
        color: $tab_hovercolor;
        span
        {
          color: $tab_hovercolor;
        }
      }
      .add:active {
        //box-shadow: inset 0 1px 2px rgba(0,0,0,.2);
        background: #ccc;
        color: #555;
      }
    }
  }
</style>
