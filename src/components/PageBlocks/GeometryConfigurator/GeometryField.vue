<template>
  <b-form-group
    label-class="text-primary"
    :label="formLabel"
  >
    <b-input-group>
      <b-form-input
        v-model="localValue.coordinates[0]"
        type="number"
        number
        :placeholder="$t('latitude')"
      />
      <b-form-input
        v-model="localValue.coordinates[1]"
        type="number"
        number
        :placeholder="$t('longitude')"
      />
      <b-input-group-append>
        <b-button
          variant="light"
          rounded
          @click="openMap"
        >
          <font-awesome-icon
            :icon="['fas', 'map-marked-alt']"
          />
        </b-button>
      </b-input-group-append>
    </b-input-group>

    <b-modal
      v-model="map.show"
      size="lg"
      title="Map"
      body-class="p-0"
      hide-header
    >
      <template #modal-footer>
        <h6
          class="w-100"
        >
          {{ $t('clickToPlaceMarker') }}
        </h6>
      </template>

      <l-map
        ref="map"
        :zoom="map.zoom"
        :center="map.center"
        style="height: 75vh; width: 100%; cursor: pointer;"
        @click="placeMarker"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          :attribution="map.attribution"
        />
        <l-marker
          v-for="(marker, i) in markers"
          :key="i"
          :lat-lng="marker"
          @click="removeMarker(i)"
        />
      </l-map>
    </b-modal>
  </b-form-group>
</template>
<script>
import { latLng } from 'leaflet'

export default {
  i18nOptions: {
    namespaces: 'field',
    keyPrefix: 'kind.geometry',
  },

  props: {
    formLabel: {
      type: String,
      required: false,
      default: '',
    },

    value: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      localValue: undefined,

      map: {
        show: false,
        zoom: 3,
        center: [30, 30],
        rotation: 0,
        attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>',
      },

      field: {},
    }
  },

  computed: {
    markers () {
      const markers = [this.localValue.coordinates]

      return markers.map(this.getLatLng).filter(c => c)
    },
  },

  watch: {
    localValue: {
      deep: true,
      handler (value) {
        const input = JSON.stringify(value)
        this.$emit('input', input)
      },
    },
  },

  created () {
    this.localValue = JSON.parse(this.value || '{"coordinates":[]}')
  },

  methods: {
    openMap () {
      const firstCoordinates = this.localValue || {}
      this.map.center = firstCoordinates.coordinates && firstCoordinates.coordinates.length ? firstCoordinates.coordinates : [30, 30]
      this.map.zoom = 3
      this.map.show = true

      setTimeout(() => {
        this.$refs.map.mapObject.invalidateSize()
      }, 100)
    },

    getLatLng (coordinates = [undefined, undefined]) {
      const [lat, lng] = coordinates

      if (lat && lng) {
        return latLng(lat, lng)
      }
    },

    placeMarker (e) {
      let { lat = 0, lng = 0 } = e.latlng || {}
      lat = Math.round(lat * 1e7) / 1e7
      lng = Math.round(lng * 1e7) / 1e7

      this.localValue = { coordinates: [lat, lng] }
    },

    removeMarker (i) {
      this.localValue = { coordinates: [] }
    },
  },
}
</script>
