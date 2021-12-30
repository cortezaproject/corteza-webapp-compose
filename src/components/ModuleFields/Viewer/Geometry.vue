<template>
  <div
    v-if="formatted"
  >
    <p
      class="mb-0"
    >
      {{ coordinates[0] }}, {{ coordinates[1] }}
    </p>

    <b-button
      variant="light"
      rounded
      @click="openMap"
    >
      <font-awesome-icon
        :icon="['fas', 'map-marked-alt']"
      />
    </b-button>

    <b-modal
      v-model="map.show"
      size="lg"
      title="Map"
      body-class="p-0"
      hide-header
      hide-footer
    >
      <l-map
        ref="map"
        :zoom="map.zoom"
        :center="map.center"
        style="height: 75vh; width: 100%;"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          :attribution="map.attribution"
        />
        <l-marker
          v-if="coordinates.length"
          :lat-lng="getLatLng(coordinates)"
        />
      </l-map>
    </b-modal>

    <errors :errors="errors" />
  </div>
</template>
<script>
import base from './base'
import { latLng } from 'leaflet'

export default {
  extends: base,

  data () {
    return {
      map: {
        show: false,
        zoom: 3,
        center: [30, 30],
        rotation: 0,
        attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>',
      },
    }
  },

  computed: {
    formatted () {
      return JSON.parse(this.value || '{}')
    },

    coordinates () {
      return this.formatted.coordinates || ['0', '0']
    },
  },

  methods: {
    openMap () {
      this.map.show = true

      this.map.center = this.coordinates.length ? this.coordinates : [30, 30]

      setTimeout(() => {
        this.$refs.map.mapObject.invalidateSize()
      }, 100)
    },

    getLatLng (coordinates = [0, 0]) {
      return latLng(coordinates[0], coordinates[1])
    },
  },
}
</script>

<style>
.multiline {
  white-space: pre-line;
}
</style>
