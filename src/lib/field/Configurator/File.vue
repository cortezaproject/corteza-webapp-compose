<template>
  <div>
    <b-form-group horizontal
                  label="Formats">
      <div><b-form-checkbox plain v-model="f.options.allowImages">Allow images</b-form-checkbox></div>
      <div><b-form-checkbox plain v-model="f.options.allowDocuments">Allow documents</b-form-checkbox></div>
    </b-form-group>

    <b-form-group horizontal
                  description="How files are represented in record page blocks"
                  label="View mode">
      <b-form-radio-group v-model="f.options.mode"
                          buttons
                          button-variant="outline-secondary"
                          size="sm"
                          name="buttons2"
                          :options="modes">
      </b-form-radio-group>
    </b-form-group>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,

  computed: {
    modes () {
      return [
        { value: 'list', text: 'List' },
        { value: 'grid', text: 'Grid' },
        { value: 'single', text: 'Single image' },
        { value: 'gallery', text: 'Gallery of images' },
      ]
    },
  },
}
</script>
