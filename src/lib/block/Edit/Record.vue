<template>
  <div>
    <field-editor
      v-for="field in fields"
      class="field"
      :record.sync="record"
      :key="field.id"
      :field="field"/>
  </div>
</template>
<script>
import FieldEditor from '@/lib/field/Editor'

export default {
  components: {
    FieldEditor,
  },

  props: {
    options: {
      type: Object,
      required: true,
    },

    module: {
      type: Object,
      required: true,
    },

    record: {
      type: Object,
      required: false, // actually true, but we'll going to fail soft here
    },
  },

  computed: {
    fields () {
      return this.module.filterFields(this.options.fields)
    },
  },
}
</script>
<style scoped lang="scss">
@import "@/assets/sass/_0.declare.scss";

.field {
  margin-bottom: 10px;

  label {
    font-weight: 900;
    display: block;
    font-size: 12px;
    font-family: $crustheavy;
  }

  div {
    min-width: 200px;
    display: inline-block;
  }
}
</style>
