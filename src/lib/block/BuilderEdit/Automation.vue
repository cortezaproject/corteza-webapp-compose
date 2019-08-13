<template>
  <fieldset class="form-group">
    <b-form-group :label="$t('block.automation.manualScript')"
                  horizontal
                  :description="$t('block.automation.scriptFootnote')">
      <b-input-group>
        <b-form-select v-model="selectedScriptID"
                       :options="scriptOptions">
          <template slot="first">
            <option disabled
                    :value="null">{{ $t('block.automation.pickScript') }}</option>
          </template>
        </b-form-select>
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
        :options="{ group: 'fields' }">
        <b-input-group class="mb-2"
                       v-for="(b,i) in o.buttons"
                       :key="b.scriptID">
          <b-input-group-prepend is-text>
            <font-awesome-icon :icon="['fas', 'grip-vertical']" class="text-secondary"></font-awesome-icon>
          </b-input-group-prepend>
            <b-form-input class="mb-0" v-model="b.label" placeholder="button label"></b-form-input>
          <b-input-group-append class="w-25">
            <b-form-select v-model="b.variant" :options="variantOptions">
            </b-form-select>
          </b-input-group-append>
          <b-input-group-append>
            <b-button @click.prevent="o.buttons.splice(i,1)" variant="link" class="text-danger">
              <font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>
            </b-button>
          </b-input-group-append>
          <p class="text-muted w-100">
            {{ $t('block.automation.script') }}: "{{ (getScriptByID(b.scriptID || b.triggerID) || {}).name }}"
          </p>
        </b-input-group>
      </draggable>
    </b-form-group>
  </fieldset>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import base from './base'
import draggable from 'vuedraggable'

export default {
  name: 'Chart',

  components: {
    draggable,
  },

  extends: base,

  data () {
    return {
      selectedScriptID: null,
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
      manualScripts: 'uaScript/manual',
      getScriptByID: 'uaScript/getByID',
    }),

    scriptOptions () {
      const anyModule = '0'
      const condition = this.module ? this.module.moduleID : anyModule

      return this.manualScripts.map(s => {
        // Already used?
        const used = (this.o.buttons.find(
          // fallback to triggerID (old structure)
          ({ scriptID, triggerID }) => (scriptID || triggerID) === s.scriptID) !== undefined
        )

        const cc = s.events['manual']

        // Compatible with module on this page?
        const isCompatible = (cc.indexOf(condition) !== -1 || cc.indexOf(anyModule) !== -1)

        return {
          value: s.scriptID,
          text: s.name,
          disabled: used || !isCompatible,
          t: s,
        }
      })
    },
  },

  created () {
    const { namespaceID } = this.namespace
    this.loadScripts({ namespaceID })

    const variants = ['primary', 'light', 'success', 'danger', 'secondary', 'warning', 'info', 'dark']
    this.o.buttons.map(b => {
      if (variants.indexOf(b.variant) < 0) {
        b.variant = 'primary'
      }
    })
  },

  methods: {
    ...mapActions({
      loadScripts: 'uaScript/load',
    }),

    handleAddButton () {
      const { scriptID, name } = this.getScriptByID(this.selectedScriptID)
      this.o.buttons.push({
        scriptID,
        label: name,
        variant: 'primary',
      })

      this.selectedScriptID = null
    },
  },
}
</script>
