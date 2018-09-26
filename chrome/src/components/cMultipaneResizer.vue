<template>
  <multipane-resizer :dir="dir" :class="dir"></multipane-resizer>
</template>

<script>
import { MultipaneResizer } from 'vue-multipane'

export default
{
  name: 'cMultipaneResizer',
  extends: MultipaneResizer,

  components:
  {
    MultipaneResizer,
  },

  props:
  {
    dir:
    {
      type: String,
      required: false,
      default: 'v',
    },
  },
}
</script>

<style scoped lang="scss">
.multipane-resizer {
  margin: 0; left: auto; /* reset default styling */
  width: 0;
  border:solid 3px #ccc;
  background: rgb(240, 240, 240);
  height: auto;
  z-index:10;
  &.v
  {
    border-top:none;
    border-bottom:none;
  }
  &.h
  {
    border-left:none;
    border-right:none;
    width: auto;
    height:0;
    top:0;
  }
}
</style>
