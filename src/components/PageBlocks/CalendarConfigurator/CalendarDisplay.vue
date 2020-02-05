<template>
  <fieldset class="form-group">
    <b-form-group horizontal
                  :label="$t('block.calendar.calendarHeader')">

      <b-form-checkbox v-model="options.header.hide"
                      :value="true"
                      :unchecked-value="false">{{ $t('block.calendar.hideHeader') }}</b-form-checkbox>
      <b-form-checkbox v-model="options.header.hidePrevNext"
                      :disabled="options.header.hide"
                      value="true"
                      :unchecked-value="false">{{ $t('block.calendar.hideNavigation') }}</b-form-checkbox>
      <b-form-checkbox v-model="options.header.hideToday"
                      :disabled="options.header.hide"
                      :value="true"
                      :unchecked-value="false">{{ $t('block.calendar.hideToday') }}</b-form-checkbox>
      <b-form-checkbox v-model="options.header.hideTitle"
                      :disabled="options.header.hide"
                      :value="true"
                      :unchecked-value="false">{{ $t('block.calendar.hideTitle') }}</b-form-checkbox>

    </b-form-group>
    <b-form-group horizontal
                  :label="$t('block.calendar.view.enabled')">
      <b-form-checkbox-group v-model="options.header.views"
                            :disabled="options.header.hide"
                            buttons
                            button-variant="outline-secondary"
                            size="sm"
                            name="buttons2"
                            :options="views">
      </b-form-checkbox-group>
    </b-form-group>

    <b-form-group horizontal
                  :description="$t('block.calendar.view.footnote')"
                  :label="$t('block.calendar.view.default')">
      <b-form-radio-group v-model="options.defaultView"
                          buttons
                          button-variant="outline-secondary"
                          size="sm"
                          name="buttons2"
                          :options="views">
      </b-form-radio-group>
    </b-form-group>
  </fieldset>
</template>
<script>
import base from '../base'
import { compose } from '@cortezaproject/corteza-js'

export default {
  extends: base,

  computed: {
    views () {
      return compose.PageBlockCalendar.availableViews()
        .map(view => ({ value: view, text: this.$t(`block.calendar.view.${view}`) }))
    },
  },
}
</script>
