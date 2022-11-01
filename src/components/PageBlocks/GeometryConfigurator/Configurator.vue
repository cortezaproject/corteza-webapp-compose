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
          <b-form-group
            :label="$t('geometry.zoom.min')"
          >
            <b-form-input
              v-model="options.zoom.min"
              :placeholder="$t('geometry.zoom.min')"
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
            :label="$t('geometry.zoom.max')"
          >
            <b-form-input
              v-model="options.zoom.max"
              :placeholder="$t('geometry.zoom.max')"
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
            :label="$t('geometry.zoom.starting')"
          >
            <b-form-input
              v-model="options.zoom.starting"
              :placeholder="$t('geometry.zoom.starting')"
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
            v-model="options.bounds.west"
            :form-label="$t('geometry.bounds.west')"
          />
        </b-col>
        <b-col
          sm="12"
          md="6"
        >
          <geometry-field
            v-model="options.bounds.east"
            :form-label="$t('geometry.bounds.east')"
          />
        </b-col>
        <b-col
          sm="12"
          md="6"
        >
          <geometry-field
            v-model="options.bounds.south"
            :form-label="$t('geometry.bounds.south')"
          />
        </b-col>
        <b-col
          sm="12"
          md="6"
        >
          <geometry-field
            v-model="options.bounds.north"
            :form-label="$t('geometry.bounds.north')"
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
