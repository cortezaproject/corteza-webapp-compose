<template>
  <tr v-if="getField(field.kind) in $options.components" :key="'field-' + field.id + '-settings'">
    <th></th>
    <td colspan="7">
      <component :is="getField(field.kind)" :field="field"></component>
    </td>
  </tr>
</template>

<script>
import FieldRelatedSettings from '@/lib/module/field/Settings/RelatedSettings.vue'
import FieldEnumSettings from '@/lib/module/field/Settings/EnumSettings.vue'

export default {
  components: {
    FieldRelatedSettings,
    FieldEnumSettings,
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
