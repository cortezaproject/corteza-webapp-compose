<template>
  <b-tab :title="$t('block.socialFeed.label')">
    <fieldset class="form-group" v-if="page.moduleID && page.moduleID !== '0'">
        <label>{{ $t('block.socialFeed.twitterProfileField') }}</label>
        <b-form-select
            :options="selectOptions"
            v-model="options.profileSourceField" />
    </fieldset>
    <fieldset class="form-group">
        <label>{{ $t('block.socialFeed.twitterProfileLabel') }}</label>
        <input class="form-control" type="text" v-model="options.profileUrl">
    </fieldset>
  </b-tab>
</template>
<script>
import base from './base'

export default {
  name: 'SocialFeed',

  extends: base,
  computed: {
    selectOptions () {
      const options = []
      if (this.module) {
        this.module.fields
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach(({ name }) => {
            options.push(name)
          })
      }
      return options
    },
  },
}
</script>
