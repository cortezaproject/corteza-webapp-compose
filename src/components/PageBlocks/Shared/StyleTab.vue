<template>
  <b-tab :title="$t('kind.file.view.style')">
    <b-row
      cols="12"
      class="mb-2 mt-2"
    >
      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.height') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.height"
              type="number"
              :placeholder="$t('kind.file.view.height')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.width') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.width"
              type="number"
              :placeholder="$t('kind.file.view.width')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.maxHeight') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.maxHeight"
              type="number"
              :placeholder="$t('kind.file.view.maxHeight')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.maxWidth') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.maxWidth"
              type="number"
              :placeholder="$t('kind.file.view.maxWidth')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.borderRadius') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.borderRadius"
              type="number"
              :placeholder="$t('kind.file.view.borderRadius')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group
          :label="$t('kind.file.view.background')"
        >
          <b-form-input
            v-model="options.backgroundColor"
            type="color"
            debounce="300"
            class="mb-1"
          />
        </b-form-group>
      </b-col>

      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.margin') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.margin"
              type="number"
              :placeholder="$t('kind.file.view.margin')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
  </b-tab>
</template>

<script>
import base from '../base'

export default {
  i18nOptions: {
    namespaces: 'field',
  },

  name: 'FileStyleTab',

  components: {},

  extends: base,

}
</script>
