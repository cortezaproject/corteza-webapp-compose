<template>
  <div>
    <template>
      <h5 class="text-primary">
        {{ $t('geometry.zoom.zoomLabel') }}
      </h5>
      <b-row
        class="mb-2 mt-4"
      >
        <b-col
          sm="12"
          md="4"
        >
          <b-form-group>
            <b-form-input
              v-model="options.zoom"
              number
              type="number"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </template>

    <hr>
    <template>
      <h5 class="text-primary">
        {{ $t('geometry.bounds.boundsLabel') }}
      </h5>
      <b-row
        class="mb-2 mt-4"
      >
        <b-col
          sm="12"
          md="6"
        >
          <geometry-field
            v-model="options.boundsUpper"
            :form-label="$t('geometry.bounds.boundsUpper')"
          />
        </b-col>
        <b-col
          sm="12"
          md="6"
        >
          <geometry-field
            v-model="options.boundsLower"
            :form-label="$t('geometry.bounds.boundsLower')"
          />
        </b-col>
      </b-row>
    </template>

    <hr>
    <template>
      <h5 class="text-primary">
        {{ $t('geometry.centerLabel') }}
      </h5>
      <b-row
        class="mb-2 mt-4"
      >
        <b-col
          sm="12"
          md="6"
        >
          <geometry-field
            v-model="options.center"
            :form-label="$t('geometry.centerLabel')"
          />
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
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
}
</script>

<style></style>
