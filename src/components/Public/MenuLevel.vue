<template>
  <ul>
    <li v-for="page in pages" :key="page.id" v-if="page.visible">
      <router-link :to="{ name: 'public.page', params: { id: page.id }}">{{ page.title }}</router-link>
      <menu-level :pages="page.children" v-if="page.children"></menu-level>
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
  },
}
</script>
