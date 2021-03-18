<template>
  <b-card no-body>
    <slot name="title" />

    <fieldset>
      <b-form-group
        :label="$t('block.metric.editStyle.color')"
        label-cols="4"
      >
        <b-form-input
          type="color"
          v-model="options.color"
          class="mb-1"
        />
      </b-form-group>

      <b-form-group
        :label="$t('block.metric.editStyle.backgroundColor')"
        label-cols="4"
      >
        <b-form-input
          type="color"
          v-model="options.backgroundColor"
          class="mb-1"
        />
      </b-form-group>

      <b-form-group
        :label="$t('block.metric.editStyle.fontSize')"
        label-cols="4"
      >
        <b-form-input
          type="number"
          v-model="options.fontSize"
          placeholder="16"
          class="mb-1"
        />
      </b-form-group>
    </fieldset>
  </b-card>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
}
</script>
