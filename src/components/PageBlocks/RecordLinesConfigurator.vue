<template>
  <b-tab :title="$t('block.recordLines.label')">
    <b-form-group
      :label="$t('block.general.module')"
    >
      <b-form-select v-model="options.moduleID" required>
        <option value="0">{{ $t('general.label.none') }}</option>
        <option
          v-for="module in availableModules"
          :key="module.moduleID"
          :value="module.moduleID">

          {{ module.name }}
        </option>
      </b-form-select>
    </b-form-group>

    <div
      v-if="!!options.moduleID && relatedModule"
    >
      <hr>
      <b-form-group
        v-if="relatedModule"
        :label="$t('block.recordLines.fieldsEdit.label')"
        label-size="lg"
        class="mb-0"
      >
        <field-picker
          :module="relatedModule"
          :fields.sync="options.fieldsEdit"
          disable-system-fields
        />
      </b-form-group>

      <b-form-group
        v-if="relatedModule"
        :label="$t('block.recordLines.fieldsView.label')"
        label-size="lg"
      >
        <field-picker
          :module="relatedModule"
          :fields.sync="options.fieldsView"
        />
      </b-form-group>

      <b-form-group
        horizontal
        :label-cols="3"
        breakpoint="md"
        :label="$t('block.recordLines.parentField.label')"
      >
        <b-form-select
          v-model="options.parentField"
          required
        >
          <option :value="undefined">
            {{ $t('general.label.none') }}
          </option>
          <option
            v-for="field in parentFields"
            :key="field.fieldID"
            :value="field.name">

            {{ field.name }}
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">
          {{ $t('block.recordLines.parentField.footnote') }}
        </b-form-text>
      </b-form-group>

      <b-form-group
        horizontal
        :label-cols="3"
        breakpoint="md"
        :label="$t('block.recordLines.positionField.label')"
      >
        <b-form-select v-model="options.positionField">
          <option :value="undefined">
            {{ $t('general.label.none') }}
          </option>
          <option
            v-for="field in positionFields"
            :key="field.fieldID"
            :value="field.name">

            {{ field.label || field.name }}
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">
          {{ $t('block.recordLines.positionField.footnote') }}
        </b-form-text>
      </b-form-group>

      <b-form-group
        horizontal
        :label-cols="3"
        breakpoint="md"
        class="mt-4"
      >
        <b-form-checkbox v-model="options.selectable">
          {{ $t('block.recordList.selectable') }}
        </b-form-checkbox>
      </b-form-group>
    </div>
  </b-tab>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import FieldPicker from 'corteza-webapp-compose/src/components/Common/Module/FieldPicker'
import { NoID } from '@cortezaproject/corteza-js'

export default {
  name: 'RecordLines',

  components: {
    FieldPicker,
  },

  extends: base,

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

    relatedModule () {
      if (this.options.moduleID !== NoID) {
        return this.$store.getters['module/getByID'](this.options.moduleID)
      } else {
        return undefined
      }
    },

    availableModules () {
      return this.modules.filter(m => m.fields.find(({ kind }) => kind === 'Record'))
    },

    parentFields () {
      return this.relatedModule.fields.filter(({ kind, isMulti, options }) => {
        if (kind === 'Record' && !isMulti) {
          return options.moduleID === this.record.moduleID
        }
      })
    },

    positionFields () {
      return this.relatedModule.fields.filter(({ kind, isMulti }) => kind === 'Number' && !isMulti)
    },
  },

  watch: {
    'options.moduleID' () {
      // Every time moduleID changes
      this.options.fieldsEdit = []
      this.options.fieldsView = []
      this.options.parentField = ''
      this.options.positionField = ''
    },
  },
}
</script>
