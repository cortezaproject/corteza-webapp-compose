<template>
  <div>
    <b-tab :title="$t('block.recordList.label')">
      <b-form-group
        class="form-group"
        :label="$t('block.general.module')"
      >
        <b-form-select v-model="options.moduleID" required>
          <option :value="undefined">{{ $t('general.label.none') }}</option>
          <option
            v-for="module in modules"
            :key="module.moduleID"
            :value="module.moduleID">

            {{ module.name }}
          </option>
        </b-form-select>
        <i>
          <i18next path="block.recordList.moduleFootnote" tag="label">
            <router-link :to="{ name: 'admin.pages'}">{{ $t('block.recordList.recordPages') }}</router-link>
          </i18next>
        </i>
      </b-form-group>

      <field-picker v-if="recordListModule" :module="recordListModule" :fields.sync="options.fields" />

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
      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordList.record.presortLabel')">
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
      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordList.record.perPage')">
        <b-form-input type="number" v-model.number="options.perPage"></b-form-input>
        <b-form-checkbox v-model="options.hidePaging">
          {{ $t('block.recordList.record.hidePaging') }}
        </b-form-checkbox>
      </b-form-group>
      <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('general.label.export')" class="mt-4">
        <b-form-checkbox v-model="options.allowExport" class="mt-2">
          {{ $t('block.recordList.export.allow') }}
        </b-form-checkbox>
      </b-form-group>
      <b-form-group horizontal :label-cols="3" breakpoint="md" class="mt-4">
        <b-form-checkbox v-model="options.selectable" class="mt-2">
          {{ $t('block.recordList.selectable') }}
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
      modules: 'module/set',
      pages: 'page/set',
    }),

    recordListModule () {
      if (this.options.moduleID !== '0') {
        return this.$store.getters['module/getByID'](this.options.moduleID)
      } else {
        return undefined
      }
    },

    modulePageID () {
      const modulePageID = []
      this.pages.filter(p => !!p.moduleID).forEach(({ pageID, moduleID }) => { modulePageID[moduleID] = pageID })
      return modulePageID
    },
  },

  watch: {
    'options.moduleID' (newModuleID) {
      // Every time moduleID changes, do a lookup among module-page pairs and
      // reset the pageID
      this.options.pageID = this.modulePageID[newModuleID] || undefined
      this.options.fields = []
    },
  },
}
</script>
