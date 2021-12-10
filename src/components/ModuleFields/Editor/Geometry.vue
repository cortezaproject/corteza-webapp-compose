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
    </b-input-group>
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,

  data () {
    return {
      map: undefined,
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
}
</script>
