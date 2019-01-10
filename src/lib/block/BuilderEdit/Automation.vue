<template>
  <fieldset class="form-group">
    <b-form-group label="Manual triggers" horizontal description="Select from the list of manual triggers. Disabled and incompatible (different module) triggers are disabled.">
      <b-input-group>
        <b-form-select v-model="selectedTriggerID" :options="triggerOptions">
          <template slot="first">
            <option disabled :value="null">Pick a trigger</option>
          </template>
        </b-form-select>
        <b-input-group-append>
          <b-button @click.prevent="handleAddButton" variant="secondary">Add</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <b-form-group label="Buttons" description="A list of manual triggers, accessible via click on a button (rename and reorder as you see fit)" horizontal v-show="o.buttons.length > 0">
      <draggable
        :list.sync="o.buttons"
        :options="{ group: 'fields' }">
        <b-input-group v-for="(b,i) in o.buttons" :key="b.triggerID">
          <b-form-input v-model="b.label" placeholder="button label"></b-form-input>
          <b-input-group-append is-text>
            Trigger "{{ (findTriggerByID(b.triggerID) || {}).name }}"
          </b-input-group-append>
          <b-input-group-append>
            <b-button @click.prevent="o.buttons.splice(i,1)" variant="secondary">x</b-button>
          </b-input-group-append>
        </b-input-group>
      </draggable>
    </b-form-group>
  </fieldset>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import draggable from 'vuedraggable'

export default {
  extends: base,
  name: 'Chart',

  computed: {
    ...mapGetters({
      triggers: 'trigger/set',
    }),

    triggerOptions () {
      return this.triggers.filter(t => {
        if (t.actions.find(a => a === 'manual') === undefined) {
          // Exclude non-manual triggers
          return false
        }

        return true
      }).map(t => {
        // Already used?
        const used = (this.o.buttons.find(b => b.triggerID === t.triggerID) !== undefined)

        // Compatible?
        const cmpt = (!this.module || t.moduleID === this.module.moduleID)

        return {
          value: t.triggerID,
          text: t.name,
          disabled: !t.enabled || used || !cmpt,
          t,
        }
      })
    },
  },

  data () {
    return {
      selectedTriggerID: null,
      charts: [],
    }
  },

  created () {
    this.$store.dispatch('trigger/load')
  },

  methods: {
    findTriggerByID (triggerID) {
      return this.triggers.find(t => t.triggerID === triggerID)
    },

    handleAddButton () {
      const t = this.findTriggerByID(this.selectedTriggerID)
      if (!t) return

      this.o.buttons.push({
        triggerID: t.triggerID,
        label: t.name,
      })
    },
  },

  components: {
    draggable,
  },
}
</script>
