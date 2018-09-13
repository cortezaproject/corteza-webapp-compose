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
            { 'component': Panel, 'link': 'https://drive.google.com' },
            { 'component': Panel, 'link': 'https://web.telegram.org' },
            { 'component': Panel, 'link': 'https://web.skype.com' },
          ],
        },
        {
          class: 'fr',
          rows: [
            { 'component': Panel, 'link': 'https://www.office.com' },
            { 'component': Panel, 'link': 'https://dropbox.com' },
            { 'component': Panel, 'link': 'https://web.whatsapp.com/' },
          ],
        },
      ],
    }
  },
}
</script>

<style>
.fr {
  float: right;
}
.fl {
  float: left;
}
.column {
  border: 1px solid red;
  width: 45%;
  height: 95vh;
}
.row {
  border: 1px solid green;
  width: 100%;
  height: 15vh;
}
</style>
