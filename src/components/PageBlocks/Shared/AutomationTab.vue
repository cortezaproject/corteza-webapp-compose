<template>
  <b-tab :title="$t('block.automation.label')">
    <b-form-group
      :label="$t('block.automation.configuredButtons')"
      horizontal
      v-show="buttons.length > 0"
    >
      <draggable
        :list.sync="buttons"
        group="buttons"
        filter=".disabled"
        handle=".draggable-handle"
      >
        <b-row
          v-for="(b, i) in buttons"
          :key="b.script"
          class="mb-2"
          no-gutters
        >
          <b-col
            cols="12"
          >
            <b-input-group>
              <b-input-group-prepend
                is-text
              >
                <b-form-checkbox
                  v-model="b.enabled"
                />
              </b-input-group-prepend>
              <b-input-group-prepend
                is-text
                :class="'draggable-handle'"
              >
                <font-awesome-icon
                  :icon="['fas', 'sort']"
                  :class="'text-primary'"
                />
              </b-input-group-prepend>
              <b-form-input
                class="mb-0"
                v-model="b.label"
                placeholder="button label"
              />
              <b-form-select
                v-model="b.variant"
                :options="variantOptions"
              />
              <b-input-group-text
              >
                <code>
                  {{ b.script }}
                </code>
              </b-input-group-text>
              <b-input-group-append>
                <b-button
                  @click.prevent="buttons.splice(i, 1)"
                  variant="link"
                  class="text-danger"
                >
                  <font-awesome-icon
                    :icon="['far', 'trash-alt']"
                  />
                </b-button>
              </b-input-group-append>
            </b-input-group>

          </b-col>
        </b-row>
      </draggable>
    </b-form-group>

    <b-form-group
      :label="$t('block.automation.availableScripts')"
      horizontal
      v-if="available.length > 0"
    >
      <b-row
        v-for="(b) in available"
        :key="b.script"
        class="mb-2"
        no-gutters
      >
        <b-col
          cols="12"
        >
          <b-input-group>
            <b-form-input
              value="b.label"
              disabled />
            <b-input-group-text
            >
              <code>
                {{ b.script }}
              </code>
            </b-input-group-text>
            <b-input-group-append
            >
              <b-button
                variant="link"
                @click.prevent="append(b)"
              >
                <font-awesome-icon
                  :icon="['far', 'plus-square']"
                  class="text-primary"
                />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
    </b-form-group>
    <p
      v-else-if="buttons.length === 0"
    >
      {{ $t('block.automation.noScripts') }}
    </p>
    <pre>
    </pre>
  </b-tab>
</template>
<script>
import draggable from 'vuedraggable'
import base from '../base'

export default {
  components: {
    draggable,
  },

  extends: base,

  props: {
    buttons: {
      type: Array,
      required: true,
    },
  },

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
    available () {
      const resourceTypes = [
        // Three base types we always include when loading list of
        // available automation scripts
        'compose',
        'compose:namespace',
        'compose:page',
      ]

      if (this.module) {
        resourceTypes.push('compose:module')
      }

      if (this.record) {
        resourceTypes.push('compose:record')
      }

      // @todo this is not a complete implementation
      //       we need to do a proper filtering via constraint matching
      //       for now, all (available) buttons can be configured
      const existing = this.buttons.map(s => s.script)

      return this.$UIHooks
        .Find(resourceTypes)
        .filter(({ script }, i, aa) => !existing.includes(script) && i === aa.findIndex(s => s.script === script))
    },
  },

  // watch: {
  //   buttons: {
  //     deep: true,
  //     handler () {
  //       this.buttons = this.buttons.filter(b => b.enabled)
  //     },
  //   },
  // },

  methods: {
    append (b) {
      const { label, script, resourceType, slot, variant } = b
      this.buttons.push({ label, script, resourceType, slot, variant })
    },
  },
}
</script>
