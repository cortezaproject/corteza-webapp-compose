<template>
  <b-tab :title="$t('block.content.label')">
    <fieldset class="form-group">
      <c-rich-text-input v-model="options.body" />
    </fieldset>
  </b-tab>
</template>
<script>
import base from './base'
import { components } from '@cortezaproject/corteza-vue'
const { CRichTextInput } = components

export default {
  name: 'Content',

  components: {
    CRichTextInput,
  },

  extends: base,
}
</script>
