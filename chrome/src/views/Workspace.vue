<template>
  <div class="workspace">
    <div class="column" :class="column.class" v-for="column in columns">
      <div class="row" v-for="row in column.rows">
        <component :is="row.component" :src="row.link"></component>
      </div>
    </div>
  </div>
</template>

<script>
import Panel from '@/components/Panel.vue'

export default {
  data () {
    return {
      columns: [
        {
          class: 'fl',
          rows: [
            { 'component': Panel, 'link': 'https://latest.rustbucket.io' }
          ],
        },
        {
          class: 'fr',
          rows: [
            { 'component': Panel, 'link': 'https://latest.rustbucket.io' }
          ],
        },
      ],
    }
  },
}
</script>

<style>
body {
	padding: 0;
	margin: 0;
	overflow: hidden;
}
.fr {
  float: right;
}
.fl {
  float: left;
}
.column {
  box-sizing: border-box;
  border: 1px solid #ccc;
  width: 50%;
  height: 100vh;
}
.row {
  width: 100%;
  height: 100vh;
}
</style>
