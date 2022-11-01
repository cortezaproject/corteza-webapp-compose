<template>
  <fieldset class="form-group">
    <div
      v-for="(feed, i) in options.feeds"
      :key="i"
    >
      <b-form-group
        horizontal
        :label="$t('calendar.feedLabel')"
      >
        <b-input-group>
          <b-form-select
            v-model="feed.resource"
            :options="feedSources"
          >
            <template slot="first">
              <option
                value=""
                :disabled="true"
              >
                {{ $t('calendar.feedPlaceholder') }}
              </option>
            </template>
          </b-form-select>

          <template
            v-if="feed.resource"
            v-slot:append
          >
            <b-button
              variant="outline-danger"
              class="border-0"
              @click="onRemoveFeed(i)"
            >
              <font-awesome-icon :icon="['far', 'trash-alt']" />
            </b-button>
          </template>
        </b-input-group>
      </b-form-group>

      <b-form-group horizontal>
        <component
          :is="configurator(feed)"
          v-if="feed.resource && configurator(feed)"
          :feed="feed"
          :modules="modules"
        />
      </b-form-group>

      <hr>
    </div>

    <b-button
      class="btn btn-url test-feed-add"
      @click.prevent="handleAddButton"
    >
      {{ $t('geometry.addEventsSource') }}
    </b-button>
  </fieldset>
</template>
<script>
import { mapGetters } from 'vuex'
import base from '../../base'
import * as configs from './configs'
import { compose } from '@cortezaproject/corteza-js'

export default {
  i18nOptions: {
    namespaces: 'block',
  },

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
      return Object.entries(compose.PageBlockGeometry.feedResources).map(([key, value]) => ({
        value,
        text: this.$t(`geometry.${key}Feed.optionLabel`),
      }))
    },
  },

  created () {
    if (this.options.feeds.length === 0) {
      this.block.options.feeds = []
    }
  },

  methods: {
    /**
     * Handles feed removal
     * @param {Number} i Feed's index
     */
    onRemoveFeed (i) {
      this.block.options.feeds.splice(i, 1)
    },

    /**
     * Handles feed's addition
     */
    handleAddButton () {
      this.block.options.feeds.push(compose.PageBlockCalendar.makeFeed())
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
