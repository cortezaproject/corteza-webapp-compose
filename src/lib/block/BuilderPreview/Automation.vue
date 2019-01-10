<template>
    <div>
      <b-button v-for="(b) in options.buttons"
                :key="b.triggerID"
                disabled>{{ b.label }}</b-button>
    </div>
</template>
<script>
import optionsPropMixin from './mixins/optionsProp'

export default {
  mixins: [
    optionsPropMixin,
  ],
}
</script>
