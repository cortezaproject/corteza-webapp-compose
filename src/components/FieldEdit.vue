<template>
  <div class="form-item">
    <template v-if="getField(field.kind) in $options.components">
      <component :is="getField(field.kind)" :field="field" :row="row" :key="'field-edit-' + field.id"></component>
    </template>
    <template v-else>
      <p>Field {{field.name}}, type {{field.kind}}, components/Field/{{field.kind.charAt(0).toUpperCase() + field.kind.substring(1)}}Edit.vue<br/>{{field}}</p>
    </template>
  </div>
</template>

<script>
import FieldTextEdit from '@/components/Field/TextEdit.vue'
import FieldEmailEdit from '@/components/Field/EmailEdit.vue'

export default {
  components: {
    FieldTextEdit,
    FieldEmailEdit,
  },
  props: {
    field: Object,
    row: Object,
  },
  methods: {
    getField (type) {
      return 'Field' + type.charAt(0).toUpperCase() + type.substring(1) + 'Edit'
    },
  },
}
</script>
