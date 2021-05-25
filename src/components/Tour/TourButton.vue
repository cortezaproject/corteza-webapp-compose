<template>
    <b-form-checkbox @change="toggle()" v-model="tourOn" name="check-button" button variant="primary" size="lg">
      {{$t('tour.buttonTour')}}
    </b-form-checkbox>
</template>

<script>

export default {
  name: 'TourButton',
  data () {
    return {
      tourOn: false,
    }
  },
  created () {
    if (JSON.parse(localStorage.getItem('compose.tour'))) {
      this.tourOn = true
    } else if (JSON.parse(localStorage.getItem('compose.tour')) === null) {
      localStorage.setItem('compose.tour', JSON.stringify(true))
      this.tourOn = true
      this.$parent.startTour()
    }
  },
  methods: {
    toggle () {
      if (this.tourOn) {
        localStorage.setItem('compose.tour', JSON.stringify(false))
      } else {
        localStorage.setItem('compose.tour', JSON.stringify(true))
        this.$parent.startTour()
      }
    },
  },
}
</script>
