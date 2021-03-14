<template>
  <b-form-group
    :label="label"
    :class="formGroupStyleClasses"
    label-class="text-primary"
    :state="state"
  >
    <multi v-if="field.isMulti" :value.sync="value" v-slot="ctx">
      <rich-text-input
        v-if="field.options.useRichTextEditor"
        v-model="value[ctx.index]"
        class="mr-2"
      />

      <b-form-textarea
        v-else-if="field.options.multiLine"
        v-model="value[ctx.index]"
        class="mr-2"
      />

      <b-form-input
        v-else
        v-model="value[ctx.index]"
        class="mr-2"
      />
      <errors :errors="errors" />
    </multi>

    <template v-else>
      <rich-text-input
        v-if="field.options.useRichTextEditor"
        v-model="value"
        class="mr-2"
      />

      <b-form-textarea
        v-else-if="field.options.multiLine"
        v-model="value"
        class="mr-2"
      />

      <b-form-input
        v-else
        v-model="value"
        class="mr-2"
      />
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
