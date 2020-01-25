<template>
  <b-tab :title="$t('block.content.label')">
    <fieldset class="form-group">
      <rich-text-input v-model="options.body" />
    </fieldset>
  </b-tab>
</template>
<script>
import base from './base'
import RichTextInput from 'corteza-webapp-compose/src/components/RichTextInput'

export default {
  name: 'Content',

  components: {
    RichTextInput,
  },

  extends: base,
}
</script>
