<template>
  <b-form-group
    :label="label"
    :class="formGroupStyleClasses"
    :state="state"
  >
    <multi v-if="field.isMulti" :value.sync="value" v-slot="ctx">
      <rich-text-input
        v-if="field.options.useRichTextEditor"
        v-model="value[ctx.index]" />
      <textarea
        v-else-if="field.options.multiLine"
        v-model="value[ctx.index]"></textarea>
      <b-form-input v-else v-model="value[ctx.index]" />
      <errors :errors="errors" />
    </multi>

    <template v-else>
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
      <errors :errors="errors" />
    </template>
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
