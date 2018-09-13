<template>
  <iframe style="width: 100%; height: 100%;" :src="src"/>
</template>

<script>
export default {
  props: {
    src: String,
  },
}
</script>
