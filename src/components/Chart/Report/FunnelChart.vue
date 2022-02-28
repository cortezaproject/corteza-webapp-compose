<template>
  <report-edit
    :report.sync="editReport"
    :modules="modules"
    :dimension-field-kind="['Select']"
    :supported-metrics="1"
    un-skippable
  >
    <template #dimension-options="{ dimension, field }">
      {{ dimension.meta.fields }} <br>
      {{ field }}
      <field-picker
        v-if="renderPicker(field)"
        :module="makeOptions(field, dimension)"
        :fields="getFields(dimension)"
        disable-system-fields
        class="d-flex flex-column"
        style="max-height: 60vh;"
        @update:fields="makeFields"
      />
      <!-- :fields.sync="selectedFields" -->
      <!-- <item-picker
        v-if="renderPicker(field)"
        :items="makeOptions(field, dimension)"–
        :selected.sync="dimension.meta.fields"
        key-prop="value"
        class="cursor-pointer"
      >
        <template #item="{ item }">
          <div>
            <span class="ml-1">
              {{ item.value }}
            </span>
          </div>
        </template>
      </item-picker> -->
    </template>
  </report-edit>
</template>

<script>
import ReportEdit from './ReportEdit'
import FieldPicker from 'corteza-webapp-compose/src/components/Common/FieldPicker'
import base from './base'
// import ItemPicker from './ItemPicker.vue'

export default {
  components: {
    ReportEdit,
    FieldPicker,
    // ItemPicker,
  },

  extends: base,

  computed: {
    selectedFields: {
      get () {
        debugger
        return this.report.dimensions[0].meta.fields
        // .map(({ value, text }) => ({
        //   value,
        //   text,
        //   name: value,
        // }))
      },

      set (field) {
        debugger
        this.editReport.dimensions[0].meta.fields = field
        // let fields = []
        // debugger
        // if (this.report.dimensions[0].meta.fields) {
        //   debugger
        //   fields = this.report.dimensions[0].meta.fields
        //     .map(f => f.value !== field.name)
        // } else {
        //   fields = this.report.dimensions[0].meta.fields.push(field)
        // }
        // this.$emit('update:editReport', field)
        // this.report.dimensions.meta.fields
      },
    },
  },

  methods: {
    renderPicker (field) {
      return field && field.kind === 'Select' && field.options.options
    },

    makeOptions (field, dimension) {
      const ff = dimension.meta.fields || []
      // debugger
      return {
        ...field.options.options
          .map(({ text, value }) => ({
            text,
            value,
            color: (ff.find(b => value === b.value) || {}).color,
          }))
          .filter(a => !dimension.meta.fields.find(b => a.value === b.value)),
      }

      // return field.options.options.map(({ text, value }) => ({
      //   text,
      //   value,
      //   color: (ff.find(b => value === b.value) || {}).color,
      // }))
    },

    makeFields (fields) {
      console.log(fields)
    },

    getFields (dimension) {
      console.warn(dimension.meta.fields.map(({ value, text }) => ({
        value,
        text,
        name: value,
      })))
      return dimension.meta.fields.map(({ value, text }) => ({
        value,
        text,
        name: value,
      }))
    },

    // makeFields (field, dimension) {
    //   // debugger
    //   // selected fields
    //   const ff = dimension.meta.fields || []
    //   // debugger
    //   const fields = field.options.options
    //     .map(({ text, value }) => ({
    //       name: value,
    //       text,
    //       value,
    //       color: (ff.find(b => value === b.value) || {}).color,
    //     }))
    //     .filter(a => dimension.meta.fields.find(b => a.value === b.value))
    //   debugger
    //   return fields
    // },
  },
}
</script>

<style scoped lang="scss">
  .cursor-pointer {
    cursor: pointer;
  }
</style>
