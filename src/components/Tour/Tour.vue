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
          // Translate button names
          this.$tours[this.tour.name].options.labels.buttonPrevious = this.$t('tour.buttonPrevious')
          this.$tours[this.tour.name].options.labels.buttonNext = this.$t('tour.buttonNext')
          this.$tours[this.tour.name].options.labels.buttonSkip = this.$t('tour.buttonSkip')
          this.$tours[this.tour.name].options.labels.buttonStop = this.$t('tour.buttonStop')
          // Start tour
          this.$tours[this.tour.name].start()
        }
      }
    },
  },
}
</script>
<style lang="scss">
/*Modified plugin css from vue-tour.css*/
body.v-tour--active {
  pointer-events: none;
}
.v-tour {
  pointer-events: auto;
}
.v-tour__target--highlighted {
  -webkit-box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  z-index: 9999;
}
.v-tour__target--relative {
  position: relative;
}
.v-step {
  background: #5C5C5C;
  color: #fff;
  max-width: 320px;
  border-radius: 1.1rem;
  -webkit-box-shadow: transparent 0 0 0 0, transparent 0 0 0 0,
    rgba(0, 0, 0, 0.1) 0 4px 6px -1px, rgba(0, 0, 0, 0.06) 0 2px 4px -1px;
  box-shadow: 0 0 0 0 transparent, 0 0 0 0 transparent,
    0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 20px;
  pointer-events: auto;
  text-align: center;
  z-index: 10000;
}
.v-step--sticky {
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.v-step--sticky .v-step__arrow {
  display: none;
}
.v-step__arrow,
.v-step__arrow:before {
  position: absolute;
  width: 10px;
  height: 10px;
  background: inherit;
}
.v-step__arrow {
  visibility: hidden;
}
.v-step__arrow--dark:before {
  background: #5C5C5C;
}
.v-step__arrow:before {
  visibility: visible;
  content: "";
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  margin-left: -5px;
}
.v-step[data-popper-placement^="top"] > .v-step__arrow {
  bottom: -5px;
}
.v-step[data-popper-placement^="bottom"] > .v-step__arrow {
  top: -5px;
}
.v-step[data-popper-placement^="right"] > .v-step__arrow {
  left: -5px;
}
.v-step[data-popper-placement^="left"] > .v-step__arrow {
  right: -5px;
}
.v-step__header {
  margin: -1rem -1rem 0.5rem;
  padding: 0.5rem;
  border-radius: 1.1rem 1.1rem 0 0 ;
  font-family: "nunito_sanssemibold";
  font-weight: 400;
}
.v-step__content {
  margin: 0 0 20px 0;
}
.v-step__button {
  background: #6897AB;
  border:none;
  border-radius: 0.3rem;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 0.8rem;
  font-size: 1rem;
  outline: none;
  padding: 0.35rem 0.4rem;
  text-align: center;
  text-decoration: none;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
  vertical-align: middle;
  white-space: nowrap;
  padding: 0.25em 1em;
  font-family: "nunito_sanssemibold";
  font-weight: 400;
}
.v-step__button:hover {
  background-color: hsla(0, 0%, 100%, 0.95);
  color: #50596c;
}
.v-step__button-skip {
  background: #E4E9EF;
  color: #2D2D2D;
  margin-right: auto;
}
.v-step__button-previous {
  margin-right: 10px;
}
.v-step__buttons{
  display: flex;
  justify-content:flex-end;
}
/*Modified css from vue-tour.css*/
</style>
