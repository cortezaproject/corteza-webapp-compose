<template>
  <b-container class="text-center">
    <b-row>
      <b-col cols="12"
             md="6">

        <b-form-group :label="$t('automation.edit.scheduledTriggers.schedule')">
          <div v-for="(s, i) in getSchedules"
               :key="i">

            <date-time :value="s.condition"
                       class="d-inline-block"
                       @input="enableByIndex(resource, 'deferred', $event, i)" />

            <confirm @confirmed="disableByIndex(resource, 'deferred', i)"
                     class="confirmation-small d-inline-block ml-3">

              <font-awesome-icon :icon="['far', 'trash-alt']" />
              <template slot="yes">
                {{ $t('general.label.yes') }}
              </template>
              <template slot="no">
                {{ $t('general.label.no') }}
              </template>
            </confirm>
          </div>
        </b-form-group>

        <b-button variant="link"
                  @click="addScheduleTrigger">

          + {{ $t('automation.edit.scheduledTriggers.scheduleAdd') }}
        </b-button>
      </b-col>

      <b-col cols="12"
             md="6">

        <b-form-group :label="$t('automation.edit.scheduledTriggers.interval')">
          <div v-for="(s, i) in getIntervals"
              :key="i">

            <interval simple
                      :value="s.condition"
                      class="d-inline-block"
                      @input="enableByIndex(resource, 'interval', $event, i)" />

            <confirm @confirmed="disableByIndex(resource, 'interval', i)"
                     class="confirmation-small d-inline-block ml-3">

              <font-awesome-icon :icon="['far', 'trash-alt']" />
              <template slot="yes">
                {{ $t('general.label.yes') }}
              </template>
              <template slot="no">
                {{ $t('general.label.no') }}
              </template>
            </confirm>
          </div>
        </b-form-group>

        <b-button variant="link"
                  @click="addIntervalTrigger">

          + {{ $t('automation.edit.scheduledTriggers.intervalAdd') }}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import automationTriggersEditor from 'corteza-webapp-common/src/mixins/automationTriggersEditor'
import { DateTime, Interval, Confirm } from 'corteza-webapp-common/src/components/Input'

export default {
  components: {
    DateTime,
    Interval,
    Confirm,
  },

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
    }
  },

  computed: {
    getSchedules () {
      return this.triggers.filter(({ event, enabled }) => enabled && event === 'deferred')
    },

    getIntervals () {
      return this.triggers.filter(({ event, enabled }) => enabled && event === 'interval')
    },
  },

  methods: {
    addIntervalTrigger () {
      this.enable(this.resource, 'interval')
    },

    addScheduleTrigger () {
      this.enable(this.resource, 'deferred')
    },
  },
}
</script>
