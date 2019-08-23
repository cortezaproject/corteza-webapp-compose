<template>
  <b-container class="text-center">
    <b-row>
      <b-col cols="12" class="text-left">
        <b-form-checkbox :checked="isValid(resource, 'manual', '0')" @change="enable(resource, 'manual', '0')">
          <i18next path="automation.edit.recordTriggers.manualNoCondition" />
        </b-form-checkbox>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col cols="2" class="text-left"><i18next path="automation.edit.recordTriggers.create" /></b-col>
      <b-col cols="2" class="text-left"><i18next path="automation.edit.recordTriggers.update" /></b-col>
      <b-col cols="2" class="text-left"><i18next path="automation.edit.recordTriggers.delete" /></b-col>
      <b-col cols="1" class="text-left"><i18next path="automation.edit.recordTriggers.manual" /></b-col>
      <b-col><b-form-input v-model="filter"
                           :placeholder="$t('automation.edit.recordTriggers.filterPlaceholder')"
                           type="search"
                           size="sm"></b-form-input></b-col>
    </b-row>
    <b-row>
      <b-col cols="1"><i18next path="automation.edit.recordTriggers.before" /></b-col>
      <b-col cols="1"><i18next path="automation.edit.recordTriggers.after" /></b-col>
      <b-col cols="1"><i18next path="automation.edit.recordTriggers.before" /></b-col>
      <b-col cols="1"><i18next path="automation.edit.recordTriggers.after" /></b-col>
      <b-col cols="1"><i18next path="automation.edit.recordTriggers.before" /></b-col>
      <b-col cols="1"><i18next path="automation.edit.recordTriggers.after" /></b-col>
      <b-col cols="1"></b-col>
    </b-row>
    <b-row v-for="(m) in filteredModules" :key="m.moduleID" class="border-top pt-1 pb-1">
      <b-col v-for="(ev) in events"
             :key="ev"
             cols="1" sm="1">
        <b-form-checkbox :checked="isValid(resource, ev, m.moduleID)"
                         @change="enable(resource, ev, m.moduleID)" />
      </b-col>
      <b-col class="text-left">{{ m.name }}</b-col>
    </b-row>
  </b-container>
</template>
<script>
import automationTriggersEditor from 'corteza-webapp-common/src/mixins/automationTriggersEditor'

export default {
  mixins: [
    automationTriggersEditor,
  ],

  props: {
    modules: {
      type: Array,
      required: true,
    },

    triggers: {
      type: Array,
      required: true,
      default () { return [] },
    },
  },

  data () {
    return {
      resource: 'compose:record',

      // all events we support
      events: [
        'beforeCreate',
        'afterCreate',
        'beforeUpdate',
        'afterUpdate',
        'beforeDelete',
        'afterDelete',
        'manual',
      ],

      // Module filtering
      filter: '',
    }
  },

  computed: {
    filteredModules () {
      let mm = [...this.modules]
      mm.sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()))

      if (this.filter && this.filter.length > 0) {
        const q = this.filter.toLocaleLowerCase()
        return mm.filter(({ name }) => name.toLocaleLowerCase().indexOf(q) > -1)
      }

      return mm
    },
  },
}
</script>
