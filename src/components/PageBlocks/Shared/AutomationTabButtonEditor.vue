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
      <b-button-group
        class="d-flex w-100"
      >
        <b-button
          v-for="({ variant, label }) in variants"
          :key="variant"
          :variant="variant"
          class="py-2"
          size="sm"
          @click="button.variant = variant"
        >
          {{ label }}
        </b-button>
      </b-button-group>
    </b-form-group>

    <code>{{ button.script }}</code>
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
        class="confirmation-small"
        variant="link-light"
      >
        <font-awesome-icon
          :icon="['far', 'trash-alt']"
        />
        <template v-slot:yes>
          {{ $t('general.label.yes') }}
        </template>
        <template v-slot:no>
          {{ $t('general.label.no') }}
        </template>
      </c-input-confirm>
    </template>
  </b-card>
</template>
<script>
import { components } from '@cortezaproject/corteza-vue'
const { CInputConfirm } = components

export default {
  components: {
    CInputConfirm,
  },

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
