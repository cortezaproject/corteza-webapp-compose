<template>
  <div>
    <b-form-group horizontal
                  :label-cols="3"
                  breakpoint="md"
                  :label="$t('block.calendar.reminderFeed.colorLabel')">

      <b-input-group>
        <b-form-input style="max-width: 50px;"
                      type="color"
                      v-model="feed.options.color" />

      </b-input-group>
    </b-form-group>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
