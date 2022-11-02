<template>
  <div>
    <div class="my-2">
      <l-map
        ref="map"
        :zoom="options.zoomStarting"
        :min-zoom="options.zoomMin"
        :max-zoom="options.zoomMax"
        :center="options.center"
        style="height: 45vh; width: 100%; cursor: pointer;"
        @update:center="updateCenter"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          :attribution="map.attribution"
        />
      </l-map>
      <b-form-text id="password-help-block">
        {{ $t('geometry.mapHelpText') }}
      </b-form-text>
    </div>
    <hr>

    <b-row
      class="mb-2 mt-4"
    >
      <b-col
        sm="12"
        md="4"
      >
        <b-form-group
          :label="$t('geometry.zoom.zoomStartingLabel')"
          class="rounded-left"
        >
          <b-form-input
            v-model="options.zoomStarting"
            number
            type="number"
          />
        </b-form-group>
      </b-col>

      <b-col
        sm="12"
        md="4"
      >
        <b-form-group
          :label="$t('geometry.zoom.zoomMinLabel')"
          class="rounded-0"
        >
          <b-form-input
            v-model="options.zoomMin"
            number
            type="number"
          />
        </b-form-group>
      </b-col>

      <b-col
        sm="12"
        md="4"
      >
        <b-form-group
          :label="$t('geometry.zoom.zoomMaxLabel')"
        >
          <b-form-input
            v-model="options.zoomMax"
            number
            type="number"
          />
        </b-form-group>
      </b-col>

      <b-col
        sm="12"
        md="4"
      >
        <b-form-group
          label-class="text-primary"
          :label="$t('geometry.centerLabel')"
        >
          <b-input-group>
            <b-form-input
              v-model="options.center[0]"
              type="number"
              number
              :placeholder="$t('latitude')"
            />
            <b-form-input
              v-model="options.center[1]"
              type="number"
              number
              :placeholder="$t('longitude')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col
        sm="12"
        md="4"
      >
        <geometry-field
          v-model="options.boundTopLeft"
          :form-label="$t('geometry.bounds.topLeft')"
        />
      </b-col>

      <b-col
        sm="12"
        md="4"
      >
        <geometry-field
          v-model="options.boundLowerRight"
          :form-label="$t('geometry.bounds.lowerRight')"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { latLng } from 'leaflet'
import base from '../base'
import GeometryField from './GeometryField'

export default {
  components: {
    GeometryField,
  },

  i18nOptions: {
    namespaces: 'block',
  },

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

      localValue: { coordinates: [] },
      center: [],
    }
  },

  computed: {
    markers () {
      const markers = [this.center]

      return markers.map(this.getLatLng).filter(c => c)
    },
  },

  methods: {
    getLatLng (coordinates = [undefined, undefined]) {
      const [lat, lng] = coordinates

      if (lat && lng) {
        return latLng(lat, lng)
      }
    },
    updateCenter (coordinates) {
      const { lat, lng } = coordinates

      this.options.center = [lat, lng]
    },
  },
}
</script>

<style></style>
