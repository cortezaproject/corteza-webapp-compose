<template>
  <fieldset class="form-group">

    <b-form-group horizontal
                  label="Calendar header">
      <b-form-checkbox plain v-model="o.header.hide" :value="true" :unchecked-value="false">Hide</b-form-checkbox><br />
      <b-form-checkbox plain v-model="o.header.hidePrevNext" :value="true" :unchecked-value="false">Hide prev/next button</b-form-checkbox><br />
      <b-form-checkbox plain v-model="o.header.hideToday" :value="true" :unchecked-value="false">Hide today button</b-form-checkbox><br />
      <b-form-checkbox plain v-model="o.header.hideTitle" :value="true" :unchecked-value="false">Hide title text</b-form-checkbox><br />

      <b-form-checkbox-group v-model="o.header.views"
                          buttons
                          button-variant="outline-secondary"
                          size="sm"
                          name="buttons2"
                          :options="o.availableViews()">
      </b-form-checkbox-group>
    </b-form-group>

    <b-form-group horizontal
                  label="Default view">
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
                    label="Configure events source">
        <b-form-select v-model="feed.moduleID"
                       :options="modules"
                       value-field="moduleID"
                       text-field="name">
          <template slot="first">
            <option :value="null">(no module)</option>
          </template>
        </b-form-select>

      </b-form-group>
      <b-form-group horizontal v-if="feed.moduleID && getModuleByID(feed.moduleID)" class="feed-config">
        <b-input-group>
          <b-input-group-append is-text>Title</b-input-group-append>
          <b-form-select v-model="feed.titleField" :options="textualFields(feed.moduleID) | optionizeFields">
            <template slot="first">
              <option disabled :value="null">(no field)</option>
            </template>
          </b-form-select>
        </b-input-group>

        <b-input-group>
          <b-input-group-append is-text>Event start</b-input-group-append>
          <b-form-select v-model="feed.startField" :options="datetimeFields(feed.moduleID) | optionizeFields">
            <template slot="first">
              <option disabled :value="null">(no field)</option>
            </template>
          </b-form-select>
        </b-input-group>

        <b-input-group>
          <b-input-group-append is-text>Event end</b-input-group-append>
          <b-form-select v-model="feed.endField" :options="datetimeFields(feed.moduleID) | optionizeFields">
            <template slot="first">
              <option :value="null">(no field, event will last 1 hour)</option>
            </template>
          </b-form-select>
        </b-input-group>

        <b-form-checkbox plain v-model="feed.allDay" :value="true" :unchecked-value="false">Show as all-day-events</b-form-checkbox><br />
      </b-form-group>
    </div>
    <b-button @click.prevent="handleAddButton" class="btn btn-url">Add events source</b-button>
  </fieldset>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import draggable from 'vuedraggable'

export default {
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

    // handleAddButton () {
    //   const t = this.findTriggerByID(this.selectedTriggerID)
    //   if (!t) return
    //
    //   this.o.buttons.push({
    //     triggerID: t.triggerID,
    //     label: t.name,
    //   })
    //
    //   this.selectedTriggerID = null
    // },
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

  components: {
    draggable,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

.modal-body {
  .form-control {
    margin-bottom: 0;
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
  margin-bottom: 2px;
}

.feed-config {
  .input-group-text {
    min-width: 150px;
  }
}

</style>
