<template>
  <iframe style="width: 100%; height: 100vh; overflow-x: hidden; overflow-y: scroll;" frameborder="0" :src="src"/>
</template>

<script>
export default {
  props: {
    src: String,
  },
}
</script>
