<template>
  <multipane-resizer></multipane-resizer>
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
      default: 'h',
    },
  },

}
</script>

<style scoped lang="scss">
.multipane-resizer {
  margin: 0; left: 0; /* reset default styling */
  width: 5px;
  background: rgb(240, 240, 240);
  height: auto;
  &.v
  {
      width: auto;
      height:5px;
      top:0;
  }
}
</style>
