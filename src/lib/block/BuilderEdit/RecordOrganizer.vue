<template>
  <div>
    <b-form-group>
      <label for="select-module">{{ $t('block.general.module') }}</label>
      <b-form-select v-model="o.moduleID" required>
        <option disabled :value="undefined">{{ $t('general.label.none') }}</option>
        <option
          v-for="module in modules"
          :key="module.moduleID"
          :value="module.moduleID">

          {{ module.name }}
        </option>
      </b-form-select>
    </b-form-group>

    <div v-if="!!o.moduleID">
      <b-form-group>
        <label>{{ $t('field.selector.available') }}</label>
        <div class="d-flex">
          <div class="border fields w-100 p-2">
            <div v-for="field in allFields" class="field" :key="field.name">
              <span v-if="field.label">{{ field.label }} ({{field.name}})</span>
              <span v-else>{{ field.name }}</span>
              <span class="small float-right">
                <span v-if="field.isSystem">{{ $t('field.selector.systemField') }}</span>
                <span v-else>{{ field.kind }}</span>
              </span>
            </div>
          </div>
        </div>
      </b-form-group>

      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordList.record.prefilterLabel')">
        <b-form-textarea :value="true"
                        :placeholder="$t('block.recordList.record.prefilterPlaceholder')"
                        v-model="o.prefilter"></b-form-textarea>
          <b-form-text>
            <i18next path="block.recordList.record.prefilterFootnote" tag="label">
              <code>${recordID}</code>
              <code>${ownerID}</code>
              <code>${userID}</code>
            </i18next>
          </b-form-text>
      </b-form-group>

      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordOrganizer.labelField.label')">
        <b-form-select v-model="o.labelField">
          <option :value="undefined">{{ $t('general.label.none') }}</option>
          <option
            v-for="(field, index) in sortableFields"
            :key="index"
            :value="field.name">

            {{ field.label || field.name }} ({{ field.kind }})
          </option>
        </b-form-select>
        <b-form-text>{{ $t('block.recordOrganizer.labelField.footnote') }}</b-form-text>
      </b-form-group>

      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordOrganizer.descriptionField.label')">
        <b-form-select v-model="o.descriptionField">
          <option :value="undefined">{{ $t('general.label.none') }}</option>
          <option
            v-for="(field, index) in sortableFields"
            :key="index"
            :value="field.name">

            {{ field.label || field.name }} ({{ field.kind }})
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">{{ $t('block.recordOrganizer.descriptionField.footnote') }}</b-form-text>
      </b-form-group>

      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordOrganizer.presortField.label')">
        <b-form-select v-model="o.presortField">
          <option :value="undefined">{{ $t('general.label.none') }}</option>
          <option
            v-for="(field, index) in sortableFields.filter(f => f.name !== o.settingField)"
            :key="index"
            :value="field.name">

            {{ field.label || field.name }} ({{ field.kind }})
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">{{ $t('block.recordOrganizer.presortField.footnote') }}</b-form-text>
      </b-form-group>

      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordOrganizer.settingField.label')">
        <b-form-select v-model="o.settingField">
          <option :value="undefined">{{ $t('general.label.none') }}</option>
          <option
            v-for="(field, index) in sortableFields.filter(f => f.name !== o.presortField)"
            :key="index"
            :value="field.name">

            {{ field.label || field.name }} ({{ field.kind }})
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">{{ $t('block.recordOrganizer.settingField.footnote') }}</b-form-text>
      </b-form-group>

      <b-form-group v-if="!!o.settingField" horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordOrganizer.settingValue.label')">
        <field-editor
          class="mb-0"
          valueOnly
          :namespace="namespace"
          :field="getSettingField"
          :record.sync="handleMockRecord" />

        <b-form-text class="text-secondary small">{{ $t('block.recordOrganizer.settingValue.footnote') }}</b-form-text>
      </b-form-group>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import FieldEditor from 'corteza-webapp-compose/src/lib/field/Editor'
import base from './base'

export default {
  name: 'RecordOrganizer',

  components: {
    FieldEditor,
  },

  extends: base,

  data () {
    return {
      disabledSortableTypes: [],
      mockRecord: null,
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

    handleMockRecord: {
      get () {
        return this.mockRecord
      },
      set (record) {
        this.o.settingValue = record.values[this.getSettingField.name]
        this.mockRecord = record
      },
    },

    getSelectedModule () {
      return this.modules.find(m => m.moduleID === this.o.moduleID)
    },

    allFields () {
      if (this.o.moduleID) {
        const selectedModule = this.getSelectedModule

        return [
          ...selectedModule.fields,
          ...selectedModule.systemFields(),
        ]
      }
      return []
    },

    sortableFields () {
      return this.allFields.filter(({ kind }) => !this.disabledSortableTypes.find(t => t === kind))
    },

    getSettingField () {
      return this.allFields.find(f => f.name === this.o.settingField)
    },
  },

  watch: {
    'o.settingField': {
      handler (settingValue) {
        if (settingValue) {
          if (this.getSettingField.isMulti) {
            this.o.settingValue = []
          } else {
            this.o.settingValue = undefined
          }
          this.setMockRecord(settingValue)
        }
      },
    },
    'o.moduleID': {
      handler (moduleID) {
        this.o.labelField = undefined
        this.o.descriptionField = undefined
        this.o.prefilter = undefined
        this.o.presortField = undefined
        this.o.settingField = undefined
        this.o.settingValue = undefined
      },
    },
  },

  created () {
    this.setMockRecord(this.o.settingField)
  },

  methods: {
    setMockRecord (settingField) {
      let record = {
        values: {},
      }

      if (settingField) {
        record.values[settingField] = this.o.settingValue
      }
      this.mockRecord = record
    },
  },
}
</script>
<style lang="scss" scoped>
.fields {
  height: 150px;
  overflow-y: auto;
  cursor: default;
}
</style>
