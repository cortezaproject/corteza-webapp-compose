<template>
    <div>
        <fieldset class="form-group" v-if="page.moduleID && page.moduleID !== '0'">
            <label>{{ $t('block.socialFeed.twitterProfileField') }}</label>
            <b-form-select
                :options="selectOptions"
                v-model="o.profileSourceField" />
        </fieldset>
        <fieldset class="form-group">
            <label>{{ $t('block.socialFeed.twitterProfileLabel') }}</label>
            <input class="form-control" type="text" v-model="o.profileUrl">
        </fieldset>
    </div>
</template>
<script>
import base from './base'

export default {
  name: 'SocialFeed',

  extends: base,
  computed: {
    selectOptions () {
      var options = []
      if (this.module) {
        this.module.fields.forEach(function (element) {
          options.push(element.name)
        })
      }
      return options
    },
  },
}
</script>
