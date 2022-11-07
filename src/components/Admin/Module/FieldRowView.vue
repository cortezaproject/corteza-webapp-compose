<template>
  <tr>
    <td />
    <td class="pl-3">
      {{ field.name }}
      <b-badge
        v-if="field.omit"
        variant="info"
        class="text-sm ml-2"
      >
        {{ $t('unavailable') }}
      </b-badge>
    </td>
    <td class="pl-3">
      {{ field.label }}
    </td>
    <td class="pl-3">
      {{ field.kind }}
    </td>
  </tr>
</template>

<script>

export default {
  i18nOptions: {
    namespaces: 'module',
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
}
</script>
