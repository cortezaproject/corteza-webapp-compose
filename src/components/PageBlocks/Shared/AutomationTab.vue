<template>
  <b-tab>
    <template #title>
      {{ $t('block.automation.label') }}
      <b-badge
        v-if="buttons.length > 0"
        pill
        variant="dark"
      >
        {{ buttons.length }}
      </b-badge>
    </template>

    <b-container>
      <b-row>
        <b-col cols="6">
          <b-card
            :header="$t('block.automation.configuredButtons')"
            footer-class="text-right"
          >
            <draggable
              :list.sync="buttons"
              group="buttons"
              filter=".disabled"
            >
              <b-button
                v-for="(b, i) in buttons"
                :key="i"
                :variant="b.variant || 'primary'"
                @click="currentButton=b"
                class="cursor-move m-1"
              >
                {{ b.label || '-' }}
              </b-button>
            </draggable>
            <template #footer>
              <b-button
                variant="link"
                @click="appendButton({ label: $t('block.automation.dummyButtonLabel'), variant: 'danger' })"
              >
                {{ $t('block.automation.addPlaceholderLabel') }}
              </b-button>
              <c-input-confirm
                @confirmed="buttons.splice(0)"
                variant="link"
                size="md"
              >
                {{ $t('block.automation.removeAll') }}
              </c-input-confirm>
            </template>
          </b-card>
        </b-col>
        <b-col cols="6">
          <button-editor
            v-if="currentButton"
            :button="currentButton"
            :description="currentDescription"
            @delete="deleteButton(currentButton);currentButton = undefined"
          />
        </b-col>
      </b-row>
      <b-row class="mt-4">
        <b-col cols="12">
          <b-card
            :header="$t('block.automation.availableScripts', { count: available.length })"
            v-if="available.length > 0"
          >
            <b-input
              type="search"
              :placeholder="$t('block.automation.searchPlaceholder')"
              class="mb-1"
              v-model="queryAvailable"
            />

            <b-list-group
              v-for="(b) in filtered"
              :key="b.script"
              class="mb-2 cursor-pointer"
              no-gutters
              @click.prevent="appendButton(b)"
            >
              <b-list-group-item>
                <div class="d-flex w-100 justify-content-between">
                  <h5>{{ b.label || b.script }}</h5>
                  <code v-if="b.label">{{ b.script }}</code>
                </div>
                <p
                  v-if="b.description"
                  class="mb-0 mt-2"
                >
                  {{ b.description }}
                </p>
                <p
                  v-else
                  class="mb-0 mt-2"
                >
                  <i>{{ $t('block.automation.noDescription') }}</i>
                </p>
              </b-list-group-item>
            </b-list-group>
          </b-card>
          <p
            v-else-if="buttons.length === 0"
          >
            {{ $t('block.automation.noScripts') }}
          </p>
        </b-col>
      </b-row>
    </b-container>

    <pre>
    </pre>
  </b-tab>
</template>
<script>
import draggable from 'vuedraggable'
import base from '../base'
import { words } from 'lodash'
import ButtonEditor from './AutomationTabButtonEditor'

export default {
  components: {
    ButtonEditor,
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
      currentButton: null,
      queryAvailable: '',
    }
  },

  computed: {
    currentDescription () {
      // Returns description of the button currently editing
      //
      // This is needed because we do not want to store
      const b = this.compatible.find(({ script }) => script === this.currentButton.script)
      if (b) {
        return b.description
      }

      return undefined
    },

    // Returns all compatible buttons
    compatible () {
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

      return this.$UIHooks.Find(resourceTypes)
    },

    // Available buttons (compatible w/o ones already added)
    available () {
      const existing = this.buttons.map(s => s.script)
      return this.compatible.filter(({ script }, i, aa) => !existing.includes(script) && i === aa.findIndex(s => s.script === script))
    },

    filtered () {
      if (!this.queryAvailable) {
        return this.available
      }

      const q = words(this.queryAvailable.toLowerCase())
      return this.available
        .filter(({ script, label, description }) => q.every(q => `${script} ${label} ${description}`.toLowerCase().search(q) > -1))
    },
  },

  methods: {
    appendButton (newButton) {
      this.currentButton = { ...newButton }
      this.buttons.push(this.currentButton)
    },

    deleteButton ({ script }) {
      const i = this.buttons.findIndex(b => b.script === script)
      if (i > -1) {
        this.buttons.splice(i, 1)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.cursor-move {
  cursor: move !important;
}

.cursor-pointer {
  cursor: pointer !important;
}
</style>
