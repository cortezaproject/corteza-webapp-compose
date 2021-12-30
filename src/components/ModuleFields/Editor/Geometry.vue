<template>
  <b-form-group
    label-class="text-primary"
    :state="state"
    :class="formGroupStyleClasses"
  >
    <template
      v-if="!valueOnly"
      #label
    >
      <div
        class="d-flex align-items-top"
      >
        <label
          class="mb-0"
        >
          {{ label }}
        </label>

        <hint
          :id="field.fieldID"
          :text="hint"
        />
      </div>
      <small
        class="form-text font-weight-light text-muted"
      >
        {{ description }}
      </small>
    </template>

    <b-input-group>
      <b-form-input
        v-model="latitude"
        type="number"
        placeholder="Latitude"
      />
      <b-form-input
        v-model="longitude"
        type="number"
        placeholder="Longitude"
      />
      <b-button
        variant="light"
        rounded
        @click="openMap"
      >
        <font-awesome-icon
          :icon="['fas', 'map-marked-alt']"
        />
      </b-button>
    </b-input-group>

    <b-modal
      v-model="map.show"
      size="lg"
      title="Map"
      body-class="p-0"
      hide-header
    >
      <template #modal-footer>
        <div>
          Click to place marker
        </div>
      </template>

      <l-map
        ref="map"
        :zoom="map.zoom"
        :center="map.center"
        style="height: 75vh; width: 100%;"
        @click="placeMarker"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          :attribution="map.attribution"
        />
        <l-marker
          v-if="coordinates.length"
          :lat-lng="getLatLng(coordinates)"
          @click="removeMarker"
        />
      </l-map>
    </b-modal>
  </b-form-group>
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
    latitude: {
      get () {
        return this.coordinates[0]
      },

      set (latitude = '0') {
        this.value = {
          ...this.value,
          coordinates: [latitude, this.coordinates[1]],
        }
      },
    },

    longitude: {
      get () {
        return this.coordinates[1]
      },

      set (longitude = '0') {
        this.value = {
          ...this.value,
          coordinates: [this.coordinates[0], longitude],
        }
      },
    },

    value: {
      get () {
        return JSON.parse(this.record.values[this.field.name] || '{}')
      },

      set (value) {
        this.record.values[this.field.name] = JSON.stringify(value)
      },
    },

    coordinates () {
      return this.value.coordinates || ['0', '0']
    },
  },

  methods: {
    openMap () {
      this.map.show = true

      setTimeout(() => {
        this.$refs.map.mapObject.invalidateSize()
      }, 100)
    },

    getLatLng (coordinates = [0, 0]) {
      return latLng(coordinates[0], coordinates[1])
    },

    placeMarker (e) {
      const { lat = 0, lng = 0 } = e.latlng || {}

      this.value = { coordinates: [lat, lng] }
    },

    removeMarker (e) {
      this.value = { coordinates: [] }
    },
  },
}
</script>
