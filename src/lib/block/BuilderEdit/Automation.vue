<template>
  <fieldset class="form-group">
    <b-form-group :label="$t('block.automation.manualTrigger')" horizontal :description="$t('block.automation.triggerFootnote')">
      <b-input-group>
        <b-form-select v-model="selectedTriggerID" :options="triggerOptions">
          <template slot="first">
            <option disabled :value="null">{{ $t('block.automation.pickTrigger') }}</option>
          </template>
        </b-form-select>
        <b-input-group-append>
          <b-button @click.prevent="handleAddButton" variant="dark">{{ $t('general.label.add') }}</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <b-form-group :label="$t('general.label.buttons')" :description="$t('block.automation.buttonFootnote')" horizontal v-show="o.buttons.length > 0">
      <draggable
        :list.sync="o.buttons"
        :options="{ group: 'fields' }">
        <b-input-group class="mb-2" v-for="(b,i) in o.buttons" :key="b.triggerID">
          <b-input-group-prepend is-text>
            <font-awesome-icon :icon="['fas', 'grip-vertical']" class="text-secondary"></font-awesome-icon>
          </b-input-group-prepend>
          <div class="btn-name">
            <b-form-input class="mb-0" v-model="b.label" placeholder="button label"></b-form-input>
            <b-input-group-append is-text>
              {{ $t('block.automation.trigger') }} "{{ (findTriggerByID(b.triggerID) || {}).name }}"
            </b-input-group-append>
          </div>
          <b-input-group-append class="btn-color">
            <b-form-select v-model="b.variant" :options="variantOptions">
            </b-form-select>
          </b-input-group-append>
          <b-input-group-append>
            <b-button @click.prevent="o.buttons.splice(i,1)" variant="link" class="text-danger">
              <font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>
            </b-button>
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
  name: 'Chart',

  components: {
    draggable,
  },

  extends: base,

  data () {
    return {
      selectedTriggerID: null,
      charts: [],
      variantOptions: [
        { value: 'primary', text: this.$t('block.automation.primaryButton') },
        { value: 'secondary', text: this.$t('block.automation.secondaryButton') },
        { value: 'success', text: this.$t('block.automation.successButton') },
        { value: 'danger', text: this.$t('block.automation.dangerButton') },
        { value: 'warning', text: this.$t('block.automation.warningButton') },
        { value: 'info', text: this.$t('block.automation.infoButton') },
        { value: 'light', text: this.$t('block.automation.lightButton') },
        { value: 'dark', text: this.$t('block.automation.darkButton') },
      ],
    }
  },

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

  created () {
    const { namespaceID } = this.namespace
    this.$store.dispatch('trigger/load', { namespaceID })

    const variants = ['primary', 'light', 'success', 'danger', 'secondary', 'warning', 'info', 'dark']
    this.o.buttons.map(b => {
      if (variants.indexOf(b.variant) < 0) {
        b.variant = 'primary'
      }
    })
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
        variant: 'primary',
      })

      this.selectedTriggerID = null
    },
  },
}
</script>

<style lang="scss" scoped>
.fa-grip-vertical {
  cursor: move;
}

.input-group-append {
  z-index: 0;

  .input-group-text {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.btn-name {
  width: calc(100% - 75px);
}

.btn-color {
  flex-grow: 1;
}

</style>
