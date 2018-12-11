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

    <fieldset class="">
      <b-form-checkbox
        :value="true"
        :unchecked-value="false"
        v-model="o.hideAddButton">
        Hide add record button
      </b-form-checkbox>
      <b-form-checkbox
        :value="true"
        :unchecked-value="false"
        v-model="o.hideSearch">
        Hide search box
      </b-form-checkbox>
    </fieldset>
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
          console.debug(`Record page for recordList set to ${module.recordPage.title} (${module.recordPage.pageID})`)
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
      }).catch(err => {
        console.error(err)
        this.error = err
      })
    }).catch(err => {
      console.error(err)
      this.error = err
    })
  },

  mixins: [
    pagesMixin,
  ],

  components: {
    FieldSelector,
  },
}
</script>
