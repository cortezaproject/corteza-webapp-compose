<template>
  <b-form-group :label="label">
    <multi v-if="field.isMulti" :value.sync="value" v-slot="ctx">
      <rich-text-input
        v-if="field.options.useRichTextEditor"
        v-model="value[ctx.index]" />
      <textarea
        v-else-if="field.options.multiLine"
        v-model="value[ctx.index]"></textarea>
      <b-form-input v-else v-model="value[ctx.index]" />
    </multi>

    <div v-else>
      <rich-text-input
        v-if="field.options.useRichTextEditor"
        v-model="value" />
      <textarea
        v-else-if="field.options.multiLine"
        class="w-100"
        v-model="value"></textarea>

      <b-form-input
        v-else
        v-model="value"></b-form-input>
    </div>

    <b-form-text v-if="validate && errors">
      <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
    </b-form-text>
  </b-form-group>
</template>

<script>
import RichTextInput from 'corteza-webapp-compose/src/components/RichTextInput'
import base from './base'

export default {
  components: {
    RichTextInput,
  },

  extends: base,
}

</script>
