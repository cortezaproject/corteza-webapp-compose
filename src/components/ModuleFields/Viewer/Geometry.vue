<template>
  <div
    v-if="localValue.length"
  >
    <div
      v-if="!valueOnly"
      class="d-flex mb-2"
    >
      <b-button
        variant="light"
        rounded
        class="w-100 ml-auto"
        @click="openMap"
      >
        Open map
        <font-awesome-icon
          :icon="['fas', 'map-marked-alt']"
        />
      </b-button>
    </div>

    <p
      v-for="(c, i) in localValue"
      :key="i"
      class="mb-0"
    >
      {{ c[0] }}, {{ c[1] }}
    </p>

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
          v-for="(marker, i) in localValue"
          :key="i"
          :lat-lng="getLatLng(marker)"
          @click="removeMarker(i)"
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
        attribution: '&copy; <a target="_blank" rel="noopener noreferrer" href="http://osm.org/copyright">OpenStreetMap</a>',
      },
    }
  },

  computed: {
    localValue () {
      if (this.field.isMulti) {
        return this.value.map(v => {
          return JSON.parse(v || '{"coordinates":[]}').coordinates || []
        })
      } else {
        return [JSON.parse(this.value || '{"coordinates":[]}').coordinates || []].filter(c => c.length)
      }
    },
  },

  methods: {
    openMap () {
      this.map.show = true

      const firstCoordinates = this.localValue[0].coordinates

      this.map.center = firstCoordinates && firstCoordinates.length ? firstCoordinates : [30, 30]

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
