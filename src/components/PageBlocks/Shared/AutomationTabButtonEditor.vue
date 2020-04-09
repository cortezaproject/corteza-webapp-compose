<template>
  <b-card
    :header="$t('block.automation.editButton')"
    footer-class="text-right"
  >
    <b-form-group
      :label="$t('block.automation.buttonLabel')"
    >
      <b-input
        v-model="button.label"
      />
    </b-form-group>
    <b-form-group
      :label="$t('block.automation.buttonVariant')"
    >
      <b-select
        class="w-100"
        size="sm"
        v-model="button.variant"
      >
        <b-select-option
          v-for="({ variant, label }) in variants"
          :key="variant"
          :value="variant"
        >
          {{ label }}
        </b-select-option>
      </b-select>
    </b-form-group>

    <code
      v-if="button.script"
    >
      {{ button.script }}
    </code>
    <b-alert
      show
      variant="warning"
      v-else
    >
      {{ $t('block.automation.noAction' )}}
    </b-alert>
    <p
      v-if="description"
      class="mb-0 mt-2"
    >
      {{ description }}
    </p>
    <p
      v-else
      class="mb-0 mt-2"
    >
      <i>{{ $t('block.automation.noDescription') }}</i>
    </p>
    <template #footer>
      <c-input-confirm
        @confirmed="$emit('delete', button)"
        variant="link-light"
      />
    </template>
  </b-card>
</template>
<script>
export default {
  props: {
    button: {
      type: Object,
      required: true,
    },

    description: {
      type: String,
      required: false,
    },
  },

  computed: {
    variants () {
      return [
        'primary',
        'secondary',
        'light',
        'dark',
        'success',
        'danger',
        'warning',
      ].map(variant => ({ variant, label: this.$t(`block.automation.${variant}Button`) }))
    },
  },
}
</script>
