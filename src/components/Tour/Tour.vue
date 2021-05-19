<template>
  <v-tour v-if="tour !== null" :name="tour.name" :steps="tour.steps"></v-tour>
</template>

<script>
import Tour from 'corteza-webapp-compose/src/tour/index'

export default {
  name: 'TourComponent',
  props: {
    name: String,
  },
  data () {
    return {
      tour: Tour[this.name],
    }
  },
  methods: {
    start () {
      if (JSON.parse(localStorage.getItem('compose.tour'))) {
        if (this.tour) {
          this.$tours[this.tour.name].start()
        }
      }
    },
  },
}
</script>
