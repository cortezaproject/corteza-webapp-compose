<template>
  <b-tab :title="$t('block.recordOrganizer.label')">
    <b-form-group>
      <label>{{ $t('block.general.module') }}</label>
      <b-form-select
        v-model="options.moduleID"
        :options="moduleOptions"
        text-field="name"
        value-field="moduleID"
        required
      />

    </b-form-group>

    <div v-if="selectedModule">
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
                         v-model.trim="options.filter" />
          <b-form-text>
            <i18next path="block.recordList.record.prefilterFootnote" tag="label">
              <code>${recordID}</code>
              <code>${ownerID}</code>
              <code>${userID}</code>
            </i18next>
          </b-form-text>
      </b-form-group>

      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordOrganizer.labelField.label')">
        <b-form-select v-model="options.labelField">
          <option value="">{{ $t('general.label.none') }}</option>
          <option
            v-for="(field, index) in selectedModuleFields"
            :key="index"
            :value="field.name">

            {{ field.label || field.name }} ({{ field.kind }})
          </option>
        </b-form-select>
        <b-form-text>{{ $t('block.recordOrganizer.labelField.footnote') }}</b-form-text>
      </b-form-group>

      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordOrganizer.descriptionField.label')">
        <b-form-select v-model="options.descriptionField">
          <option value="">{{ $t('general.label.none') }}</option>
          <option
            v-for="(field, index) in selectedModuleFields"
            :key="index"
            :value="field.name">

            {{ field.label || field.name }} ({{ field.kind }})
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">{{ $t('block.recordOrganizer.descriptionField.footnote') }}</b-form-text>
      </b-form-group>

      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordOrganizer.positionField.label')">
        <b-form-select v-model="options.positionField">
          <option value="">{{ $t('general.label.none') }}</option>
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
        <b-form-select v-model="options.groupField">
          <option value="">{{ $t('general.label.none') }}</option>
          <option
            v-for="(field, index) in groupFields"
            :key="index"
            :value="field.name">

            {{ field.label || field.name }}
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">{{ $t('block.recordOrganizer.groupField.footnote') }}</b-form-text>
      </b-form-group>

      <b-form-group
        v-if="options.groupField"
        :label="$t('block.recordOrganizer.group.label')"
        :label-cols="3"
        breakpoint="md"
        horizontal
        class="mb-0"
      >
        <field-editor
          class="mb-0"
          valueOnly
          v-bind="mock"
        />
        <b-form-text class="text-secondary small">{{ $t('block.recordOrganizer.group.footnote') }}</b-form-text>
      </b-form-group>
    </div>
  </b-tab>
</template>
<script>
import FieldEditor from '../ModuleFields/Editor'
import { mapGetters } from 'vuex'
import { compose, validator, NoID } from '@cortezaproject/corteza-js'
import base from './base'

export default {
  name: 'RecordOrganizer',

  components: {
    FieldEditor,
  },

  extends: base,

  data () {
    return {
      /*
        This are mocks that allow us to use the field editor component.
        Since we want all the field kinds to work properly out of the box, the field editor component is best for this case.
      */
      mock: {
        namespace: undefined,
        module: undefined,
        field: undefined,
        record: undefined,
        errors: new validator.Validated(),
      },
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

    moduleOptions () {
      return [
        { moduleID: NoID, name: this.$t('general.label.none') },
        ...this.modules,
      ]
    },

    selectedModule () {
      return this.modules.find(m => m.moduleID === this.options.moduleID)
    },

    selectedModuleFields () {
      if (this.selectedModule) {
        return [...this.selectedModule.fields].sort((a, b) => a.label.localeCompare(b.label))
      }
      return []
    },

    allFields () {
      if (this.options.moduleID) {
        return [
          ...this.selectedModuleFields,
          ...this.selectedModule.systemFields(),
        ]
      }
      return []
    },

    positionFields () {
      return this.selectedModuleFields.filter(({ kind, isMulti }) => kind === 'Number' && !isMulti)
    },

    groupFields () {
      return this.selectedModuleFields.filter(({ isMulti }) => !isMulti)
    },

    group () {
      return this.allFields.find(f => f.name === this.options.groupField)
    },
  },

  watch: {
    'options.moduleID': {
      handler () {
        this.options.labelField = ''
        this.options.descriptionField = ''
        this.options.positionField = ''
        this.options.groupField = ''
      },
    },

    'options.groupField': {
      immediate: true,
      handler (newGroupField, oldGroupField) {
        // If this is not the immediate call
        if (oldGroupField) {
          this.options.group = undefined
        }

        if (newGroupField) {
          newGroupField = this.groupFields.find(f => f.name === newGroupField)
          this.mock.namespace = this.namespace
          this.mock.field = compose.ModuleFieldMaker(newGroupField)
          this.mock.field.apply({ name: 'group' })
          this.mock.module = new compose.Module({ fields: [this.mock.field] }, this.namespace)
          this.mock.record = new compose.Record(this.mock.module, { group: this.options.group })
        }
      },
    },

    'mock.record.values.group': {
      handler (group) {
        this.options.group = group
      },
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
