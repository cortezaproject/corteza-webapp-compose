<template>
  <fieldset class="form-group">

    <!-- Feed list -->
    <div v-for="(feed, i) in o.feeds"
         :key="i">

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

            <b-button @click="onRemoveFeed(i)"
                      variant="outline-danger"
                      class="border-0">

              <font-awesome-icon :icon="['far', 'trash-alt']" />
            </b-button>
          </template>
        </b-input-group>
      </b-form-group>

      <b-form-group horizontal>
        <!-- source configurator -->
        <component v-if="feed.resource && configurator(feed)"
                  :is="configurator(feed)"
                  :feed="feed"
                  :modules="modules" />

      </b-form-group>

      <hr />
    </div>

    <b-button @click.prevent="handleAddButton"
              class="btn btn-url test-feed-add">

      {{ $t('block.calendar.addEventsSource') }}
    </b-button>
  </fieldset>
</template>
<script>
import { mapGetters } from 'vuex'
import base from '../../base'
import Feed from 'corteza-webapp-compose/src/lib/block/Calendar/feed'
import { resources } from 'corteza-webapp-compose/src/lib/block/Calendar'
import * as configs from './configs'

export default {
  components: {
  },

  extends: base,

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

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
  },

  created () {
    if (this.o.feeds.length === 0) {
      this.o.feeds = []
    }
  },

  methods: {
    /**
     * Handles feed removal
     * @param {Number} i Feed's index
     */
    onRemoveFeed (i) {
      this.o.feeds.splice(i, 1)
    },

    /**
     * Handles feed's addition
     */
    handleAddButton () {
      this.o.feeds.push(new Feed())
    },

    /**
     * configurator uses feed's resource to determine what configurator to use.
     * If it can't find an apropriate component, undefined is returned
     * @param {Feed} feed Feed in qestion
     * @returns {Component|undefined}
     */
    configurator (feed) {
      if (!feed.resource) {
        return
      }
      const r = feed.resource.split(':').pop()
      return configs[r]
    },
  },
}
</script>
