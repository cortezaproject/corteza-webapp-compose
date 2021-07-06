<template>
  <div>
    <b-tab :title="$t('block.recordList.label')">
      <b-form-group
        class="form-group"
        :label="$t('block.general.module')"
      >
        <b-form-select
          v-model="options.moduleID"
          :options="moduleOptions"
          text-field="name"
          value-field="moduleID"
          required
        />
        <b-form-text class="text-secondary small">
          <i18next path="block.recordList.moduleFootnote" tag="label">
            <router-link :to="{ name: 'admin.pages'}">
              {{ $t('block.recordList.recordPage') }}
            </router-link>
          </i18next>
        </b-form-text>
      </b-form-group>

      <b-form-group
        v-if="recordListModule"
        :label="$t('block.recordList.fields')"
        label-size="lg"
      >
        <field-picker
          :module="recordListModule"
          :fields.sync="options.fields"
        />
      </b-form-group>

      <b-form-group
        v-if="recordListModule"
        horizontal
        :label-cols="3"
        breakpoint="md"
      >
        <b-form-checkbox
          v-model="options.editable"
          :disabled="disableInlineEditor"
        >
          {{ $t('block.recordList.record.inlineEditorAllow') }}
        </b-form-checkbox>
      </b-form-group>

      <div
        v-if="options.editable"
      >
        <b-form-group
          v-if="recordListModule && options.editable"
          :label="$t('block.recordList.editFields')"
          label-size="lg"
          class="mb-0"
        >
          <field-picker
            :module="recordListModule"
            :field-subset="options.fields"
            :fields.sync="options.editFields"
            group="edit-fields"
            disable-system-fields
          />
        </b-form-group>

        <b-form-group
          horizontal
          :label-cols="3"
          breakpoint="md"
          :label="$t('block.recordList.refField.label')"
        >
          <b-form-select
            v-model="options.refField"
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
            {{ $t('block.recordList.refField.footnote') }}
          </b-form-text>
        </b-form-group>

        <b-form-group
          horizontal
          :label-cols="3"
          breakpoint="md"
          :label="$t('block.recordList.positionField.label')"
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
            {{ $t('block.recordList.positionField.footnote') }}
          </b-form-text>
        </b-form-group>

        <b-form-group
          v-if="options.positionField"
          horizontal
          :label-cols="3"
          breakpoint="md"
        >
          <b-form-checkbox v-model="options.draggable">
            {{ $t('block.recordList.record.draggable') }}
          </b-form-checkbox>
        </b-form-group>
      </div>
      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordList.record.newLabel')">
        <b-form-checkbox v-model="options.hideAddButton">
          {{ $t('block.recordList.record.hideAddButton') }}
        </b-form-checkbox>
      </b-form-group>
      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordList.record.prefilterLabel')">
        <b-form-textarea :value="true"
                        :placeholder="$t('block.recordList.record.prefilterPlaceholder')"
                        v-model="options.prefilter"></b-form-textarea>
          <b-form-text>
            <i18next path="block.recordList.record.prefilterFootnote" tag="label">
              <code>${recordID}</code>
              <code>${ownerID}</code>
              <code>${userID}</code>
            </i18next>
          </b-form-text>
        <b-form-checkbox v-model="options.hideSearch">
          {{ $t('block.recordList.record.prefilterHideSearch') }}
        </b-form-checkbox>
      </b-form-group>
      <b-form-group
        v-if="!options.positionField"
        horizontal
        :label-cols="3"
        breakpoint="md"
        :label="$t('block.recordList.record.presortLabel')"
      >
        <b-form-textarea :value="true"
                        :placeholder="$t('block.recordList.record.presortPlaceholder')"
                        v-model="options.presort"></b-form-textarea>
        <b-form-text>
          {{ $t('block.recordList.record.presortFootnote') }}
        </b-form-text>
        <b-form-checkbox v-model="options.hideSorting">
          {{ $t('block.recordList.record.presortHideSort') }}
        </b-form-checkbox>
      </b-form-group>
      <b-form-group
        v-if="!options.editable"
        horizontal
        :label-cols="3"
        breakpoint="md"
        :label="$t('block.recordList.record.perPage')"
      >
        <b-form-input type="number" v-model.number="options.perPage" class="mb-2"></b-form-input>
        <b-form-checkbox v-model="options.hidePaging">
          {{ $t('block.recordList.record.hidePaging') }}
        </b-form-checkbox>
        <b-form-checkbox v-if="!options.hidePaging" v-model="options.fullPageNavigation">
          {{ $t('block.recordList.record.fullPageNavigation') }}
        </b-form-checkbox>
        <b-form-checkbox v-if="!options.hidePaging" v-model="options.showTotalCount">
          {{ $t('block.recordList.record.showTotalCount') }}
        </b-form-checkbox>
      </b-form-group>
      <b-form-group horizontal :label-cols="3" breakpoint="md" class="mt-4">
        <b-form-checkbox v-model="options.allowExport">
          {{ $t('block.recordList.export.allow') }}
        </b-form-checkbox>
      </b-form-group>
      <b-form-group horizontal :label-cols="3" breakpoint="md" class="mt-4">
        <b-form-checkbox v-model="options.selectable">
          {{ $t('block.recordList.selectable') }}
        </b-form-checkbox>
      </b-form-group>
      <b-form-group horizontal :label-cols="3" breakpoint="md" class="mt-4">
        <b-form-checkbox v-model="options.hideRecordReminderButton">
          {{ $t('block.recordList.hideRecordReminderButton') }}
        </b-form-checkbox>
        <b-form-checkbox v-model="options.hideRecordCloneButton">
          {{ $t('block.recordList.hideRecordCloneButton') }}
        </b-form-checkbox>
        <b-form-checkbox v-model="options.hideRecordEditButton" :disabled="options.editable">
          {{ $t('block.recordList.hideRecordEditButton') }}
        </b-form-checkbox>
        <b-form-checkbox v-model="options.hideRecordViewButton" :disabled="options.editable">
          {{ $t('block.recordList.hideRecordViewButton') }}
        </b-form-checkbox>
        <b-form-checkbox v-model="options.hideRecordPermissionsButton" :disabled="options.editable">
          {{ $t('block.recordList.hideRecordPermissionsButton') }}
        </b-form-checkbox>
      </b-form-group>
    </b-tab>
    <automation-tab
      v-bind="$props"
      :module="recordListModule"
      :buttons.sync="options.selectionButtons"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { NoID } from '@cortezaproject/corteza-js'
import base from './base'
import FieldPicker from 'corteza-webapp-compose/src/components/Common/Module/FieldPicker'
import AutomationTab from './Shared/AutomationTab'

export default {
  name: 'RecordList',

  components: {
    FieldPicker,
    AutomationTab,
  },

  extends: base,

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
      modules: 'module/set',
      pages: 'page/set',
    }),

    moduleOptions () {
      return [
        { moduleID: NoID, name: this.$t('general.label.none') },
        ...this.modules,
      ]
    },

    recordListModule () {
      if (this.options.moduleID !== NoID) {
        return this.getModuleByID(this.options.moduleID)
      } else {
        return undefined
      }
    },

    recordListModuleRecordPage () {
      // Relying on pages having unique moduleID,
      if (this.options.moduleID !== NoID) {
        return this.pages.find(p => p.moduleID === this.options.moduleID)
      } else {
        return undefined
      }
    },

    parentFields () {
      if (this.recordListModule) {
        return this.recordListModule.fields.filter(({ kind, isMulti, options }) => {
          if (kind === 'Record' && !isMulti && this.record) {
            return options.moduleID === this.record.moduleID
          }
        })
      }
      return []
    },

    positionFields () {
      if (this.recordListModule) {
        return this.recordListModule.fields.filter(({ kind, isMulti }) => kind === 'Number' && !isMulti)
      }
      return []
    },

    /*
     Inline record editor is disabled if:
      - Page is not record page
      - An inline record editor for the same module already exists
      - Record list module doesn't have record page (inline record autoselected and disabled)
    */
    disableInlineEditor () {
      const thisModuleID = this.options.moduleID

      // Finds another inline editor block with the same recordListModulea as this one
      const otherInlineWithSameModule = !!this.page.blocks.find(({ kind, options }, index) => {
        if (this.blockIndex !== index) {
          return kind === 'RecordList' && options.editable && options.moduleID === thisModuleID
        }
      })

      return this.page.moduleID === NoID || otherInlineWithSameModule || !this.recordListModuleRecordPage
    },
  },

  watch: {
    'options.moduleID' (newModuleID) {
      // Every time moduleID changes
      this.options.fields = []
      this.options.editable = false

      // If recordListModule doesn't have record page, auto check inline record editor
      if (newModuleID !== NoID) {
        if (!this.recordListModuleRecordPage) {
          this.options.editable = true
        }
      }
    },

    'options.editable' (value) {
      this.options.editFields = []
      this.options.positionField = undefined

      if (value) {
        this.options.hideRecordEditButton = true
        this.options.hideRecordViewButton = true
        this.options.hidePaging = true
        const f = this.recordListModule.fields.find(({ options: { moduleID } }) => moduleID === this.module.moduleID)
        this.options.refField = f ? f.name : undefined
      } else {
        this.options.refField = undefined
      }
    },

    'options.positionField' (v) {
      if (!v) {
        this.options.draggable = false
      }

      this.options.hideSorting = true
      this.options.presort = ''
    },

    'options.fields' (fields) {
      this.options.editFields = this.options.editFields.filter(a => fields.some(b => a.name === b.name))
    },
  },
}
</script>
