<template>
  <div v-if="record && options" class="record">
    <div v-for="(field, index) in fields"
         class="field"
         :key="index">
      <label>{{ field.label || field.name }}</label>
      <div>
        <field-viewer
          :field="field"
          value-only
          :record="record || {}"></field-viewer>
      </div>
    </div>
  </div>
  <div v-else>Can not render this block without a record</div>
</template>
<script>
import optionsPropMixin from './mixins/optionsProp'
import FieldViewer from '@/lib/field/Viewer'

export default {
  props: {
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

  mixins: [
    optionsPropMixin,
  ],

  components: {
    FieldViewer,
  },
}
</script>
<style scoped lang="scss">
@import "@/assets/sass/_0.declare.scss";

.record {
  .field {
    margin-bottom: 5px;
    label {
      color: $appgrey;
      font-weight: normal;
      width: 150px;
      display: inline-block;
    }
    div {
      min-width: 200px;
      display: inline-block;
    }
  }
}
</style>
