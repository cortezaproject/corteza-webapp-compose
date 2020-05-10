<template>
  <tr>
    <td
      v-if="!fixed"
      v-b-tooltip.hover
      class="handle text-center align-middle"
    >
      <font-awesome-icon
        :icon="['fas', 'sort']"
        class="text-secondary"
      />
    </td>

    <td>
      <slot
        name="report-label"
        :report="report"
      />
      <b-btn
        variant="primary"
        class="ml-2"
        @click="$emit('edit', report)"
      >
        {{ $t('general.label.edit') }}
      </b-btn>
      <b-btn
        variant="outline-danger"
        class="ml-1"
        @click="$emit('remove', report)"
      >
        {{ $t('general.label.remove') }}
      </b-btn>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    report: {
      type: Object,
      required: true,
      default: () => ({}),
    },

    // Specifies that this item can't be moved
    fixed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>
