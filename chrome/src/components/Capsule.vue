<template>
  <!-- slot gets the content of holder div -->
  <span><slot/></span>
</template>

<script>
export default
{
  name: 'Capsule',
  components:
  {
  },
  props:
  {
    color: String,
    default: '',
  },
  data: function ()
  {
    return {
      var: false,
    }
  },
}
</script>

<style scoped lang="scss">
  @import '@/assets/sass/_0.declare.scss';
  span
  {
    background-color:$pfbgcolor;
    line-height:1;
    display:inline-block;
    padding:0.2rem 0.5rem;
    vertical-align:middle;
    border-radius:2rem;
    font-weight:normal;
    font-size:1rem;
    font-family:$crustsemibold;
    text-transform:uppercase;
    margin-left:1rem;
  }
</style>
