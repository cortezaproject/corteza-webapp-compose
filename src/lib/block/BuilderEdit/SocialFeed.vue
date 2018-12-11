<template>
    <div>
        <fieldset class="form-group" v-if="page.moduleID && page.moduleID !== '0'">
            <label>Field that contains Twitter Profile URL for a record</label>
            <b-form-select
                :options="selectOptions"
                v-model="o.profileSourceField" />
        </fieldset>
        <fieldset class="form-group">
            <label>Twitter Profile URL for list pages i.e (https://twitter.com/bloomberg)</label>
            <input class="form-control" type="text" v-model="o.profileUrl">
        </fieldset>
    </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
  name: 'SocialFeed',
  computed: {
    selectOptions () {
      var options = []
      if (this.page.module) {
        this.page.module.fields.forEach(function (element) {
          options.push(element.name)
        })
      }
      return options
    },
  },
}
</script>
