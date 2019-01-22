<template>
    <div>
      <b-button v-for="(b) in options.buttons"
                :key="b.triggerID"
                variant="dark"
                @click.prevent="runTriggers({ triggerID: b.triggerID, module, record })">{{ b.label }}</b-button>
    </div>
</template>
<script>
import base from './base'
import triggerRunner from '@/mixins/trigger_runner'

export default {
  extends: base,

  mixins: [
    triggerRunner,
  ],
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

.btn {
  border-radius: 0;
  margin-bottom: 5px;
}

</style>
