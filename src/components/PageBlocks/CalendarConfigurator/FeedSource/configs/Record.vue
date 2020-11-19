<template>
  <div>
    <template v-if="feed.options">
      <b-form-group horizontal
                    :label-cols="3"
                    breakpoint="md"
                    :label="$t('block.calendar.recordFeed.moduleLabel')">

        <b-input-group>
          <b-form-select v-model="feed.options.moduleID"
                        :options="modules"
                        value-field="moduleID"
                        text-field="name">

            <template slot="first">
              <option :value="null">{{ $t('block.calendar.recordFeed.modulePlaceholder') }}</option>
            </template>
          </b-form-select>
        </b-input-group>
      </b-form-group>

      <template v-if="module">
        <b-form-group horizontal
                      :label-cols="3"
                      breakpoint="md"
                      :label="$t('block.calendar.recordFeed.colorLabel')">

        <b-input-group>
          <b-form-input style="max-width: 50px;"
                        type="color"
                        v-model="feed.options.color" />

        </b-input-group>
      </b-form-group>
        <b-form-group horizontal
                      :label-cols="3"
                      breakpoint="md"
                      :label="$t('block.calendar.recordFeed.titleLabel')">

          <b-form-select v-model="feed.titleField"
                        :options="titleFields | optionizeFields">

            <template slot="first">
              <option disabled :value="null">{{ $t('block.calendar.recordFeed.titlePlaceholder') }}</option>
            </template>
          </b-form-select>
        </b-form-group>

        <b-form-group horizontal
                      :label-cols="3"
                      breakpoint="md"
                      :label="$t('block.calendar.recordFeed.eventStartFieldLabel')">
          <b-form-select v-model="feed.startField"
                        :options="dateFields | optionizeFields">

            <template slot="first">
              <option disabled :value="null">
                {{ $t('block.calendar.recordFeed.eventStartFieldPlaceholder') }}
              </option>
            </template>
          </b-form-select>

          <b-form-text v-if="hasMultiFields"
                       class="test-multi-field-ntf">
            {{ $t('block.calendar.recordFeed.noMultiFields') }}
          </b-form-text>
        </b-form-group>

        <b-form-group horizontal
                      :label-cols="3"
                      breakpoint="md"
                      :label="$t('block.calendar.recordFeed.eventEndFieldLabel')">
          <b-form-select v-model="feed.endField"
                        :options="dateFields | optionizeFields">

            <template slot="first">
              <option :value="null">
                {{ $t('block.calendar.recordFeed.eventEndFieldPlaceholder') }}
              </option>
            </template>
          </b-form-select>

          <b-form-text v-if="hasMultiFields"
                       class="test-multi-field-ntf">
            {{ $t('block.calendar.recordFeed.noMultiFields') }}
          </b-form-text>

          <b-form-checkbox v-model="feed.allDay"
                           class="mt-3"
                           :value="true"
                           :unchecked-value="false">

            {{ $t('block.calendar.recordFeed.eventAllDay') }}
          </b-form-checkbox>
        </b-form-group>

        <br />

        <b-form-group horizontal
                      :label-cols="3"
                      breakpoint="md"
                      :label="$t('block.calendar.recordFeed.prefilterLabel')">
          <b-form-textarea :value="true"
                          :placeholder="$t('block.calendar.recordFeed.prefilterPlaceholder')"
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
      return [...this.module.fields]
        .filter(f => ['String', 'Email', 'Url'].includes(f.kind))
        .sort((a, b) => a.label.localeCompare(b.label))
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

      const moduleFields = this.module.fields.slice().sort((a, b) => a.label.localeCompare(b.label))
      return [...moduleFields, ...this.module.systemFields()]
        .filter(f => f.kind === 'DateTime' && !f.isMulti)
    },
  },
}
</script>
