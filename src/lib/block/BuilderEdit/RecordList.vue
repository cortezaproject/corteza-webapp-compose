<template>
  <div>
    <fieldset class="form-group">
      <label for="select-module">Module</label>
      <select v-model="o.moduleID" required class="form-control" id="select-module">
        <option disabled selected>---</option>
        <option
          v-for="module in modules"
          :key="module.moduleID"
          :disabled="!modulePageID[module.moduleID]"
          :value="module.moduleID"
        >{{ module.name }}</option>
      </select>
      <i>Disabled modules on the list do not have <router-link :to="{ name: 'admin.pages'}">record pages</router-link> available.</i>
    </fieldset>

    <field-selector v-if="recordListModule" :module="recordListModule" :fields.sync="o.fields" />

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
import { mapGetters } from 'vuex'
import base from './base'
import FieldSelector from './inc/FieldSelector'

export default {
  extends: base,
  name: 'RecordList',

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

  components: {
    FieldSelector,
  },
}
</script>
