<template>
  <p>Field {{field.name}}, type {{field.kind}}, components/Field/{{field.kind.charAt(0).toUpperCase() + field.kind.substring(1)}}Edit.vue</p>
</template>

<script>
export default {
  props: {
    field: Object,
  },
}
</script>
