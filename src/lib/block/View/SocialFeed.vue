<template>
    <div>
        {{ options }}
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
