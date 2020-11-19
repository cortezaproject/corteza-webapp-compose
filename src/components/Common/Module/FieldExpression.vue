<template>
  <b-input-group>
    <b-input-group-prepend>
      <b-button variant="dark">ƒ</b-button>
    </b-input-group-prepend>
    <slot v-bind:value="value">
      <b-form-input
        v-model="value"
        :placeholder="$t('field.expression.placeholder')"
      />
    </slot>
    <b-input-group-addon
      class="m-1"
    >
      <!-- no prompt/confirmation on empty input -->
      <c-input-confirm
        :no-prompt="value.length === 0"
        @confirmed="$emit('remove')"
      />
    </b-input-group-addon>
  </b-input-group>
</template>
<script>

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
}
</script>
