<template>
  <b-tab :title="$t('block.recordOrganizer.label')">
    <b-form-group>
      <label>{{ $t('block.general.module') }}</label>
      <b-form-select v-model="o.moduleID" required>
        <option :value="undefined">{{ $t('general.label.none') }}</option>
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
                        v-model.trim="o.filter"></b-form-textarea>
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
            v-for="(field, index) in selectedModule.fields"
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
            v-for="(field, index) in selectedModule.fields"
            :key="index"
            :value="field.name">

            {{ field.label || field.name }} ({{ field.kind }})
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">{{ $t('block.recordOrganizer.descriptionField.footnote') }}</b-form-text>
      </b-form-group>

      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordOrganizer.positionField.label')">
        <b-form-select v-model="o.positionField">
          <option :value="undefined">{{ $t('general.label.none') }}</option>
          <option
            v-for="(field, index) in positionFields"
            :key="index"
            :value="field.name">

            {{ field.label || field.name }}
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">{{ $t('block.recordOrganizer.positionField.footnote') }}</b-form-text>
      </b-form-group>

      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordOrganizer.groupField.label')">
        <b-form-select v-model="o.groupField">
          <option :value="undefined">{{ $t('general.label.none') }}</option>
          <option
            v-for="(field, index) in groupFields"
            :key="index"
            :value="field.name">

            {{ field.label || field.name }}
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">{{ $t('block.recordOrganizer.groupField.footnote') }}</b-form-text>
      </b-form-group>

      <b-form-group horizontal
                    v-if="o.groupField"
                    :label-cols="3"
                    breakpoint="md"
                    :label="$t('block.recordOrganizer.group.label')">
        <b-form-input v-model="o.group" />

        <b-form-text class="text-secondary small">{{ $t('block.recordOrganizer.group.footnote') }}</b-form-text>
      </b-form-group>
    </div>
  </b-tab>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import { RecordOrganizer } from './../RecordOrganizer'

export default {
  name: 'RecordOrganizer',

  extends: base,

  data () {
    return {
      mockRecord: { values: {} },
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
        this.o.group = record.values[this.groupField]
        this.mockRecord = record
      },
    },

    selectedModule () {
      return this.modules.find(m => m.moduleID === this.o.moduleID)
    },

    allFields () {
      if (this.o.moduleID) {
        return [
          ...this.selectedModule.fields,
          ...this.selectedModule.systemFields(),
        ]
      }
      return []
    },

    positionFields () {
      return this.selectedModule.fields.filter(({ kind, isMulti }) => kind === 'Number' && !isMulti)
    },

    groupFields () {
      return this.selectedModule.fields.filter(({ kind, isMulti }) => kind === 'String' && !isMulti)
    },

    group () {
      return this.allFields.find(f => f.name === this.o.settingField)
    },
  },

  watch: {
    /*
    'o.groupField': {
      handler (group) {
        if (group) {
          if (this.group.isMulti) {
            this.o.group = []
          } else {
            this.o.group = undefined
          }
          this.setMockRecord(group)
        }
      },
    },
     */
    'o.moduleID': {
      handler (moduleID) {
        this.o = new RecordOrganizer({ moduleID })
      },
    },
  },

  created () {
    // this.setMockRecord(this.o.groupField)
  },

  methods: {
    setMockRecord (groupField) {
      let record = {
        values: {},
      }

      if (groupField) {
        record.values[groupField] = this.o.group
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
