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
    <b-form-group label="Buttons" :description="$t('block.automation.buttonFootnote')" horizontal v-show="o.buttons.length > 0">
      <draggable
        :list.sync="o.buttons"
        :options="{ group: 'fields' }">
        <b-input-group v-for="(b,i) in o.buttons" :key="b.triggerID">
          <b-input-group-prepend is-text>
            <font-awesome-icon :icon="['fas', 'grip-vertical']"></font-awesome-icon>
          </b-input-group-prepend>
          <div class="btn-name">
            <b-form-input v-model="b.label" placeholder="button label"></b-form-input>
            <b-input-group-append is-text>
              {{ $t('block.automation.trigger') }} "{{ (findTriggerByID(b.triggerID) || {}).name }}"
            </b-input-group-append>
          </div>
          <b-input-group-append class="btn-color">
            <b-form-select v-model="b.variant" :options="variantOptions">
            </b-form-select>
          </b-input-group-append>
          <b-input-group-append>
            <b-button @click.prevent="o.buttons.splice(i,1)" variant="url">
              <i class="action icon-trash"></i>
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
        { value: 'blue', text: this.$t('block.automation.blueButton') },
        { value: 'secondary', text: this.$t('block.automation.whiteButton') },
        { value: 'green', text: this.$t('block.automation.greenButton') },
        { value: 'red', text: this.$t('block.automation.redButton') },
        { value: 'dark', text: this.$t('block.automation.greyButton') },
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
        variant: 'blue',
      })

      this.selectedTriggerID = null
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

.modal-body {
  .form-control {
    margin-bottom: 0;
    min-width: 150px;
    z-index: 1;
  }
}

.btn,
.input-group-text {
  border-radius: 0;
}

.fa-grip-vertical {
  color: $appgrey;
  cursor: move;
}

.input-group {
  margin-bottom: 15px;
}

.input-group-append {
  z-index: 0;

  .input-group-text {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
}

.btn-name {
  display: inline-flex;
  width: calc(100% - 28px);
  padding-right: 20px;
}

.custom-select {
  margin: 2px 9px 0 27px;
}

.btn-color {
  flex-grow: 1;
}

.btn-url {
  text-decoration: none;
  color: $appred;
  margin-top: -30px;

  &:hover {
    color: $appred;
  }
}

</style>
