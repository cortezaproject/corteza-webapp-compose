<template>
  <div>
    <fieldset class="form-group">
      <label for="select-module">{{ $t('block.recordList.module') }}</label>
      <select v-model="o.moduleID" required class="form-control" id="select-module">
        <option disabled selected>---</option>
        <option
          v-for="module in modules"
          :key="module.moduleID"
          :disabled="!modulePageID[module.moduleID]"
          :value="module.moduleID"
        >{{ module.name }}</option>
      </select>
      <i>
        <i18next path="block.recordList.moduleFootnote" tag="label">
          <router-link :to="{ name: 'admin.pages'}">{{ $t('block.recordList.recordPages') }}</router-link>
        </i18next>
      </i>
    </fieldset>

    <field-picker v-if="recordListModule" :module="recordListModule" :fields.sync="o.fields" />

    <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordList.record.newLabel')">
        <b-form-checkbox v-model="o.hideAddButton">
          {{ $t('block.recordList.record.hideAddButton') }}
        </b-form-checkbox>
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
      <b-form-checkbox v-model="o.hideSearch">
        {{ $t('block.recordList.record.prefilterHideSearch') }}
      </b-form-checkbox>
    </b-form-group>
    <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordList.record.presortLabel')">
      <b-form-textarea :value="true"
                       :placeholder="$t('block.recordList.record.presortPlaceholder')"
                       v-model="o.presort"></b-form-textarea>
      <b-form-text>
        {{ $t('block.recordList.record.presortFootnote') }}
      </b-form-text>
      <b-form-checkbox v-model="o.hideSorting">
        {{ $t('block.recordList.record.presortHideSort') }}
      </b-form-checkbox>
    </b-form-group>
    <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('block.recordList.record.perPage')">
      <b-form-input type="number" v-model.number="o.perPage"></b-form-input>
      <b-form-checkbox v-model="o.hidePaging">
        {{ $t('block.recordList.record.hidePaging') }}
      </b-form-checkbox>
    </b-form-group>
    <b-form-group horizontal :label-cols="3" breakpoint="md" :label="$t('general.label.export')" class="mt-4">
      <b-form-checkbox v-model="o.allowExport" class="mt-2">
        {{ $t('block.recordList.export.allow') }}
      </b-form-checkbox>
    </b-form-group>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import FieldPicker from 'corteza-webapp-compose/src/components/Common/Module/FieldPicker'

export default {
  name: 'RecordList',

  components: {
    FieldPicker,
  },

  extends: base,

  computed: {
    ...mapGetters({
      modules: 'module/set',
      pages: 'page/set',
    }),

    recordListModule () {
      if (this.o.moduleID !== '0') {
        return this.$store.getters['module/getByID'](this.o.moduleID)
      } else {
        return undefined
      }
    },

    modulePageID () {
      let modulePageID = []
      this.pages.filter(p => !!p.moduleID).forEach(({ pageID, moduleID }) => { modulePageID[moduleID] = pageID })
      return modulePageID
    },
  },

  watch: {
    'o.moduleID' (newModuleID) {
      // Everytime moduleID changes, do a lookup among module-page pairs and
      // reset the pageID
      this.o.pageID = this.modulePageID[newModuleID] || undefined
      this.o.fields = []
    },
  },
}
</script>
