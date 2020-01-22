<template>
  <b-tab :title="$t('block.automation.label')">
    <fieldset class="form-group">
      <b-form-group :label="$t('block.automation.manualScript')"
                    horizontal
                    :description="$t('block.automation.scriptFootnote')">
        <b-input-group>
          <c-automation-script-picker
            style="width: 70%;"
            v-model="selectedScript"
            :events="['onManual']"
            :resources="['compose', 'compose:namespace', 'compose:module', 'compose:page', 'compose:record']"
            :filter="scriptFilter"
          />
          <b-input-group-append>
            <b-button @click.prevent="handleAddButton"
                      variant="dark">{{ $t('general.label.add') }}</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-form-group :label="$t('general.label.buttons')"
                    :description="$t('block.automation.buttonFootnote')"
                    horizontal
                    v-show="o.buttons.length > 0">
        <draggable
          :list.sync="o.buttons"
          :options="{ group: 'buttons' }"
          handle=".draggable-handle"
        >
          <b-row
            v-for="(b, i) in o.buttons"
            :key="i"
            class="mb-2"
            no-gutters
          >
            <b-col cols="8">
              <b-input-group>
                <b-input-group-prepend is-text class="draggable-handle">
                  <font-awesome-icon :icon="['fas', 'grip-vertical']" class="text-secondary"></font-awesome-icon>
                </b-input-group-prepend>
                <b-form-input class="mb-0" v-model="b.label" placeholder="button label"></b-form-input>
              </b-input-group>
            </b-col>
            <b-col cols="3">
              <b-form-select v-model="b.variant" :options="variantOptions"></b-form-select>
            </b-col>
            <b-col cols="1">
              <b-button @click.prevent="o.buttons.splice(i,1)" variant="link" class="text-danger">
                <font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>
              </b-button>
            </b-col>
            <b-col offset="0" cols="12" class="p-2">
              <b-container v-if="scriptByKey(b.script)">
                <div>
                  {{ scriptByKey(b.script).label }}
                  [<code>{{ scriptByKey(b.script).name }}</code>]
                </div>
                <div>
                  {{ scriptByKey(b.script).description }}
                </div>
              </b-container>
              <div v-else-if="b.script">
                Reference to an unexisting script.
              </div>
              <div v-else-if="b.scriptID">
                Reference to legacy automation script/trigger.
              </div>
            </b-col>
          </b-row>
        </draggable>
      </b-form-group>
    </fieldset>
  </b-tab>
</template>
<script>
import base from './base'
import draggable from 'vuedraggable'
import CAutomationScriptPicker from 'corteza-webapp-compose/src/components/Admin/Automation/ScriptPicker'
import { mapGetters } from 'vuex'

export default {
  name: 'Chart',

  components: {
    CAutomationScriptPicker,
    draggable,
  },

  extends: base,

  data () {
    return {
      selectedScript: null,
      charts: [],
      variantOptions: [
        { value: 'primary', text: this.$t('block.automation.primaryButton') },
        { value: 'secondary', text: this.$t('block.automation.secondaryButton') },
        { value: 'light', text: this.$t('block.automation.lightButton') },
        { value: 'dark', text: this.$t('block.automation.darkButton') },
        { value: 'success', text: this.$t('block.automation.successButton') },
        { value: 'danger', text: this.$t('block.automation.dangerButton') },
        { value: 'warning', text: this.$t('block.automation.warningButton') },
      ],
    }
  },

  computed: {
    ...mapGetters({
      scriptByKey: 'automation/getByKey',
    }),

    // scriptOptions () {
    //   const anyModule = '0'
    //   const condition = this.module ? this.module.moduleID : anyModule
    //
    //   console.log(this.scripts)
    //
    //   return this.scripts.map(s => {
    //     // Already used?
    //     const used = (this.o.buttons.find(
    //       // fallback to triggerID (old structure)
    //       ({ scriptID, triggerID }) => (scriptID || triggerID) === s.scriptID) !== undefined
    //     )
    //
    //     const cc = s.events['manual']
    //
    //     // Compatible with module on this page?
    //     const isCompatible = (cc.indexOf(condition) !== -1 || cc.indexOf(anyModule) !== -1)
    //
    //     return {
    //       value: s.scriptID,
    //       text: s.name,
    //       disabled: used || !isCompatible,
    //       t: s,
    //     }
    //   })
    // },
  },

  created () {
    // const { namespaceID } = this.namespace
    // this.loadScripts({ namespaceID })
    //

    const variants = this.variantOptions.map(({ value }) => value)
    this.o.buttons.map(b => {
      if (variants.indexOf(b.variant) < 0) {
        b.variant = 'primary'
      }
    })
  },

  methods: {
    // ...mapActions({
    // loadScripts: 'uaScript/load',
    // }),

    handleAddButton () {
      const { name: script, label } = this.selectedScript
      this.o.buttons.push({
        script,
        label: label || script,
        variant: 'primary',
      })
      this.selectedScript = null
    },

    scriptFilter ({ triggers = [] }) {
      // assume that scripts are filtered by events & resources on triggers
      // and we only get resource=compose:record

      // @todo filter by module, namespace
      // const module = this.module.name
      // const namespace = this.namespace.slug
      //
      // for (const { constraints = [] } of triggers) {
      //   for (const { name, op, values } of constraints) {
      //
      //   }
      // }

      return true
    },
  },
}
</script>
