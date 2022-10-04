<template>
  <wrap
    v-bind="$props"
    v-on="$listeners"
  >
    <nylas-composer id="9316cc65-49aa-451e-b9a3-8a436a6935dd" />
  </wrap>
</template>
<script>
import base from './base'
import '@nylas/components-composer'

export default {
  i18nOptions: {
    namespaces: 'notification',
  },

  extends: base,
}
</script>
