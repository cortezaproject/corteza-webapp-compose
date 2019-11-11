<template>
  <div>
    <!-- define feed resource; eg. module, reminders, google calendar, ... -->
    <b-form-group horizontal
                  :label="$t('block.calendar.feedLabel')">

      <b-input-group>
        <b-form-select v-model="feed.resource"
                       :options="feedSources">

          <template slot="first">
            <option :value="null"
                    :disabled="true">

              {{ $t('block.calendar.feedPlaceholder') }}
            </option>
          </template>
        </b-form-select>

        <!-- allow feed removal -->
        <template v-if="feed.resource"
                  v-slot:append>

          <b-button @click="removeFeed"
                    variant="outline-danger"
                    class="border-0">

            <font-awesome-icon :icon="['far', 'trash-alt']" />
          </b-button>
        </template>
      </b-input-group>
    </b-form-group>

    <b-form-group horizontal>
      <!-- source configurator -->
      <component v-if="feed.resource && configurator"
                 :is="configurator"
                 :feed="feed"
                 v-bind="$props" />

    </b-form-group>

    <hr />
  </div>
</template>

<script>
import * as configs from './loader'
import base from './base'
import { resources } from 'corteza-webapp-compose/src/lib/block/Calendar'

export default {
  extends: base,

  computed: {
    /**
     * Provides a set of available feed sources.
     * @returns {Array}
     */
    feedSources () {
      return Object.entries(resources).map(([ key, value ]) => ({
        value,
        text: this.$t(`block.calendar.${key}Feed.optionLabel`),
      }))
    },

    /**
     * configurator uses feed's resource to determine what configurator to use.
     * If it can't find an apropriate component, undefined is returned
     * @returns {Component|undefined}
     */
    configurator () {
      if (!this.feed.resource) {
        return
      }
      const r = this.feed.resource.split(':').pop()
      return configs[r]
    },
  },

  methods: {
    removeFeed () {
      this.$emit('removeFeed')
    },
  },
}
</script>
