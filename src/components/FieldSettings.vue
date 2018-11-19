<template>
  <tr v-if="getField(field.kind) in $options.components" :key="'field-' + field.id + '-settings'">
    <td>&nbsp;</td>
    <td colspan="6">
      <component :is="getField(field.kind)" :field="field"></component>
    </td>
  </tr>
</template>

<script>
import FieldRelatedSettings from '@/components/Field/RelatedSettings.vue'

export default {
  components: {
    FieldRelatedSettings,
  },
  props: {
    field: Object,
    row: Object,
  },
  methods: {
    getField (type) {
      return 'Field' + type.charAt(0).toUpperCase() + type.substring(1) + 'Settings'
    },
  },
}
</script>
