<template>
  <wrap
    v-bind="$props"
    v-on="$listeners"
  >
    <div
      v-if="processing"
      class="d-flex align-items-center justify-content-center h-100"
    >
      <b-spinner />
    </div>
    <template v-else>
      <l-map
        :zoom="map.zoom"
        :center="map.center"
        :bounds="bounds"
        class="w-100"
        style="height: 100%;"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          :attribution="map.attribution"
        />
        <l-polygon
          v-for="(geometry, i) in geometries"
          :key="`polyline-${i}`"
          :lat-lngs="geometry.map(value => value.geometry)"
          :color="colors[i]"
        />

        <l-marker
          v-for="(marker, i) in localValue"
          :key="i"
          :lat-lng="marker"
        />
      </l-map>
    </template>
  </wrap>
</template>

<script>
import {
  LPolygon,
} from 'vue2-leaflet'
import { compose } from '@cortezaproject/corteza-js'
import { mapGetters, mapActions } from 'vuex'
import { latLng, latLngBounds } from 'leaflet'
import base from './base'

export default {

  components: { LPolygon },

  extends: base,

  data () {
    return {
      map: {
        zoom: 4,
        center: [47.31322, -1.319482],
      },

      processing: false,
      show: false,

      geometries: [],
      colors: [],
      markers: [],
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

    localValue () {
      const values = []

      this.geometries.forEach((geo) => {
        geo.forEach((value) => {
          values.push(this.getLatLng(value.geometry))
        })
      })

      return values
    },

    bounds () {
      let { boundsUpper, boundsLower } = this.options

      boundsUpper = this.parseGeometryField(boundsUpper)
      boundsLower = this.parseGeometryField(boundsLower)

      return latLngBounds([this.getLatLng(boundsUpper), this.getLatLng(boundsLower)])
    },
  },

  created () {
    this.loadEvents()
  },

  methods: {
    ...mapActions({
      findModuleByID: 'module/findByID',
    }),

    loadEvents () {
      this.geometries = []

      this.processing = true

      this.colors = this.options.feeds.map(feed => feed.options.color)
      this.map.zoom = this.options.zoom.starting
      this.map.center = this.parseGeometryField(this.options.center)

      Promise.all(this.options.feeds.map((feed, idx) => {
        return this.findModuleByID({ namespace: this.namespace, moduleID: feed.options.moduleID })
          .then(module => {
            return compose.PageBlockGeometry.RecordFeed(this.$ComposeAPI, module, this.namespace, feed, this.loaded)
              .then(events => {
                this.geometries[idx] = events.map(e => ({
                  title: e.values[feed.titleField],
                  geometry: this.parseGeometryField(e.values[feed.geometryField]),
                }))

                this.fitMap()
              })
          })
      })).finally(() => {
        this.processing = false
      })
    },

    parseGeometryField (value) {
      return JSON.parse(value || '{"coordinates":[]}').coordinates || []
    },

    getLatLng (coordinates = [undefined, undefined]) {
      const [lat, lng] = coordinates

      if (lat && lng) {
        return latLng(lat, lng)
      }
    },

    fitMap () {
      const bounds = latLngBounds(this.localValue)
      this.bounds = bounds
    },

  },
}
</script>
