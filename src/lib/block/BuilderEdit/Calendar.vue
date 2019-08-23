<template>
  <fieldset class="form-group">

    <b-form-group horizontal
                  :label="$t('block.calendar.calendarHeader')">
      <b-form-checkbox
                       v-model="o.header.hide"
                       :value="true"
                       :unchecked-value="false">{{ $t('block.calendar.hideHeader') }}</b-form-checkbox>
      <b-form-checkbox
                       v-model="o.header.hidePrevNext"
                       :disabled="o.header.hide"
                       value="true"
                       :unchecked-value="false">{{ $t('block.calendar.hideNavigation') }}</b-form-checkbox>
      <b-form-checkbox
                       v-model="o.header.hideToday"
                       :disabled="o.header.hide"
                       :value="true"
                       :unchecked-value="false">{{ $t('block.calendar.hideToday') }}</b-form-checkbox>
      <b-form-checkbox
                       v-model="o.header.hideTitle"
                       :disabled="o.header.hide"
                       :value="true"
                       :unchecked-value="false">{{ $t('block.calendar.hideTitle') }}</b-form-checkbox>

    </b-form-group>
    <b-form-group horizontal
                  :label="$t('block.calendar.view.enabled')">
      <b-form-checkbox-group v-model="o.header.views"
                             :disabled="o.header.hide"
                             buttons
                             button-variant="outline-secondary"
                             size="sm"
                             name="buttons2"
                             :options="o.availableViews()">
      </b-form-checkbox-group>
    </b-form-group>

    <b-form-group horizontal
                  :description="$t('block.calendar.view.footnote')"
                  :label="$t('block.calendar.view.default')">
      <b-form-radio-group v-model="o.defaultView"
                          buttons
                          button-variant="outline-secondary"
                          size="sm"
                          name="buttons2"
                          :options="o.availableViews()">
      </b-form-radio-group>
    </b-form-group>
    <div v-for="(feed, index) in o.feeds" :key="index">
      <hr/>
      <b-form-group horizontal
                    :label="$t('block.calendar.eventsSource')">
        <b-form-select v-model="feed.moduleID"
                       :options="modules"
                       value-field="moduleID"
                       text-field="name">
          <template slot="first">
            <option :value="null">{{ $t('block.calendar.noModule') }}</option>
          </template>
        </b-form-select>

      </b-form-group>
      <b-form-group horizontal v-if="feed.moduleID && getModuleByID(feed.moduleID)" class="feed-config">
        <b-input-group>
          <b-input-group-append is-text>{{ $t('general.label.title') }}</b-input-group-append>
          <b-form-select v-model="feed.titleField" :options="textualFields(feed.moduleID) | optionizeFields">
            <template slot="first">
              <option disabled :value="null">{{ $t('block.calendar.noField') }}</option>
            </template>
          </b-form-select>
        </b-input-group>

        <b-input-group>
          <b-input-group-append is-text>{{ $t('block.calendar.eventStart') }}</b-input-group-append>
          <b-form-select v-model="feed.startField" :options="datetimeFields(feed.moduleID) | optionizeFields">
            <template slot="first">
              <option disabled :value="null">{{ $t('block.calendar.noField') }}</option>
            </template>
          </b-form-select>
        </b-input-group>

        <b-input-group>
          <b-input-group-append is-text>{{ $t('block.calendar.eventEnd') }}</b-input-group-append>
          <b-form-select v-model="feed.endField" :options="datetimeFields(feed.moduleID) | optionizeFields">
            <template slot="first">
              <option :value="null">{{ $t('block.calendar.noFieldOneHour') }}</option>
            </template>
          </b-form-select>
        </b-input-group>

        <b-form-checkbox v-model="feed.allDay" :value="true" :unchecked-value="false">{{ $t('block.calendar.eventAllDay') }}</b-form-checkbox><br />
      </b-form-group>
    </div>
    <b-button @click.prevent="handleAddButton" class="btn btn-url">{{ $t('block.calendar.addEventsSource') }}</b-button>
  </fieldset>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },

  filters: {
    optionizeFields (ff) {
      return ff.map(f => {
        return {
          text: f.label || f.name,
          value: f.name,
        }
      })
    },
  },

  extends: base,

  data () {
    return {}
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
      getModuleByID: 'module/getByID',
    }),
  },

  created () {
    if (this.o.feeds.length === 0) {
      this.o.feeds = [{ moduleID: null }]
    }
  },

  methods: {
    textualFields (moduleID) {
      const m = this.getModuleByID(moduleID)
      return [ ...m.fields ].filter(f => ['String', 'Email', 'Url'].includes(f.kind))
    },

    datetimeFields (moduleID) {
      const m = this.getModuleByID(moduleID)
      return [ ...m.fields, ...m.systemFields() ].filter(f => f.kind === 'DateTime')
    },

    handleAddButton () {
      this.o.feeds.push({})
    },
  },
}
</script>
