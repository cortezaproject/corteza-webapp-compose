<template>
  <div>
    <fieldset class="form-group">
      <label for="select-module">Module</label>
      <select v-model="o.moduleID" required class="form-control" id="select-module">
        <option disabled selected>---</option>
        <option
          v-for="module in modules"
          :key="module.id"
          :disabled="!module.recordPage"
          :value="module.moduleID"
        >{{ module.name }}</option>
      </select>
      <i>Disabled modules on the list do not have <router-link :to="{ name: 'admin.pages'}">record pages</router-link> available.</i>
    </fieldset>

    <field-selector v-if="selectedModule" :module="selectedModule" :fields.sync="o.fields" />

    <b-form-group horizontal :label-cols="3" breakpoint="md" label="New records">
        <b-form-checkbox :value="true"
                         :unchecked-value="false"
                         plain
                         v-model="o.hideAddButton">Hide add record button</b-form-checkbox>
    </b-form-group>
    <b-form-group horizontal :label-cols="3" breakpoint="md" label="Prefilter records">
      <b-form-textarea :value="true"
                       placeholder="field1 = 1 AND field2 = 232"
                       v-model="o.prefilter"></b-form-textarea>
        <b-form-text>
          Simplified SQL condition (WHERE ...) syntax is suppoeted.
          Variables like <code>${recordID}</code>, <code>${ownerID}</code> and
          <code>${userID}</code> are evaluated (when available).
        </b-form-text>
      <b-form-checkbox :value="true"
                       :unchecked-value="false"
                       plain
                       v-model="o.hideSearch">Hide search box</b-form-checkbox>
    </b-form-group>
    <b-form-group horizontal :label-cols="3" breakpoint="md" label="Presort records">
      <b-form-textarea :value="true"
                       placeholder="field1 DESC, field2 ASC"
                       v-model="o.presort"></b-form-textarea>
      <b-form-text>
        Simplified SQL condition (ORDER BY ...) syntax is suppoeted.
      </b-form-text>
      <b-form-checkbox :value="true"
                       :unchecked-value="false"
                       plain
                       v-model="o.hideSorting">Hide sorting</b-form-checkbox>
    </b-form-group>
    <b-form-group horizontal :label-cols="3" breakpoint="md" label="Records per page">
      <b-form-input type="number" v-model.number="o.perPage"></b-form-input>
      <b-form-checkbox :value="true"
                       :unchecked-value="false"
                       plain
                       v-model="o.hidePaging">Hide paging</b-form-checkbox>
    </b-form-group>
  </div>
</template>
<script>
import base from './base'
import pagesMixin from './mixins/pages'
import FieldSelector from './inc/FieldSelector'

export default {
  extends: base,
  name: 'RecordList',

  data () {
    return {
      modules: [],
    }
  },

  computed: {
    selectedModule () {
      return this.modules.find(m => m.moduleID === this.o.moduleID)
    },
  },

  watch: {
    'o.moduleID' (newModuleID) {
      if (newModuleID) {
        const module = this.modules.find(m => m.moduleID === newModuleID)

        if (module && module.recordPage) {
          this.o.pageID = module.recordPage.pageID
        }
      }
    },
  },

  created () {
    this.$crm.pageList({ recordPagesOnly: true }).then(pp => {
      // @todo extend API endpoint to support fetching only record pages
      this.$crm.moduleList({}).then(mm => {
        this.modules = mm.map(m => {
          m.recordPage = pp.find(p => p.moduleID === m.moduleID)
          return m
        })
      }).catch(this.defaultErrorHandler('Could not load pages'))
    }).catch(this.defaultErrorHandler('Could not load modules'))
  },

  mixins: [
    pagesMixin,
  ],

  components: {
    FieldSelector,
  },
}
</script>
