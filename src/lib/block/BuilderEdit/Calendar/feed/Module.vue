<template>
  <div>
    <template v-if="feed.options">
      <b-form-group horizontal
                    :label-cols="3"
                    breakpoint="md"
                    :label="$t('block.calendar.moduleFeed.moduleLabel')">

        <b-input-group>
          <b-form-select v-model="feed.options.moduleID"
                        :options="modules"
                        value-field="moduleID"
                        text-field="name">

            <template slot="first">
              <option :value="null">{{ $t('block.calendar.moduleFeed.modulePlaceholder') }}</option>
            </template>
          </b-form-select>
        </b-input-group>
      </b-form-group>

      <template v-if="this.module">
        <b-form-group horizontal
                      :label-cols="3"
                      breakpoint="md"
                      :label="$t('block.calendar.moduleFeed.colorLabel')">

        <b-input-group>
          <b-form-input style="max-width: 50px;"
                        type="color"
                        v-model="feed.options.color" />

        </b-input-group>
      </b-form-group>
        <b-form-group horizontal
                      :label-cols="3"
                      breakpoint="md"
                      :label="$t('block.calendar.moduleFeed.titleLabel')">

          <b-form-select v-model="feed.titleField"
                        :options="titleFields | optionizeFields">

            <template slot="first">
              <option disabled :value="null">{{ $t('block.calendar.moduleFeed.titlePlaceholder') }}</option>
            </template>
          </b-form-select>
        </b-form-group>

        <b-form-group horizontal
                      :label-cols="3"
                      breakpoint="md"
                      :label="$t('block.calendar.moduleFeed.eventStartFieldLabel')">
          <b-form-select v-model="feed.startField"
                        :options="dateFields | optionizeFields">

            <template slot="first">
              <option disabled :value="null">
                {{ $t('block.calendar.moduleFeed.eventStartFieldPlaceholder') }}
              </option>
            </template>
          </b-form-select>

          <b-form-text v-if="hasMultiFields"
                       class="test-multi-field-ntf">
            {{ $t('block.calendar.moduleFeed.noMultiFields') }}
          </b-form-text>
        </b-form-group>

        <b-form-group horizontal
                      :label-cols="3"
                      breakpoint="md"
                      :label="$t('block.calendar.moduleFeed.eventEndFieldLabel')">
          <b-form-select v-model="feed.endField"
                        :options="dateFields | optionizeFields">

            <template slot="first">
              <option :value="null">
                {{ $t('block.calendar.moduleFeed.eventEndFieldPlaceholder') }}
              </option>
            </template>
          </b-form-select>

          <b-form-text v-if="hasMultiFields"
                       class="test-multi-field-ntf">
            {{ $t('block.calendar.moduleFeed.noMultiFields') }}
          </b-form-text>

          <b-form-checkbox v-model="feed.allDay"
                           class="mt-3"
                           :value="true"
                           :unchecked-value="false">

            {{ $t('block.calendar.moduleFeed.eventAllDay') }}
          </b-form-checkbox>
        </b-form-group>

        <br />

        <b-form-group horizontal
                      :label-cols="3"
                      breakpoint="md"
                      :label="$t('block.calendar.moduleFeed.prefilterLabel')">
          <b-form-textarea :value="true"
                          :placeholder="$t('block.calendar.moduleFeed.prefilterPlaceholder')"
                          v-model="feed.options.prefilter" />

        </b-form-group>
      </template>
    </template>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,

  computed: {
    /**
     * Finds the module, this feed configuratior should use
     * @returns {Module|undefined}
     */
    module () {
      if (!(this.feed.options || {}).moduleID) {
        return
      }

      return this.modules.find(({ moduleID }) => moduleID === this.feed.options.moduleID)
    },

    /**
     * Determines if given module has any multi-fields
     * @returns {Boolean}
     */
    hasMultiFields () {
      if (!this.module) {
        return false
      }
      return this.module.fields.reduce((acc, { isMulti }) => acc || isMulti, false)
    },

    /**
     * Determines available title fields based on the given module.
     * @returns {Array}
     */
    titleFields () {
      if (!this.module) {
        return []
      }
      return [ ...this.module.fields ].filter(f => ['String', 'Email', 'Url'].includes(f.kind))
    },

    /**
     * Determines available date fields based on the given module.
     * Currently ignores multi-fields
     * @returns {Array}
     */
    dateFields () {
      if (!this.module) {
        return []
      }
      return [ ...this.module.fields, ...this.module.systemFields() ]
        .filter(f => f.kind === 'DateTime' && !f.isMulti)
    },
  },
}
</script>
