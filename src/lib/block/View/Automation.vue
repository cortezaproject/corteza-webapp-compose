<template>
    <div class="flex">
      <b-button v-for="(b) in options.buttons"
                :key="b.triggerID"
                :variant="b.variant || 'blue'"
                @click.prevent="runTriggers({ triggerID: b.triggerID, action: 'manual', module, record })">{{ b.label }}</b-button>
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
  flex-grow: 1;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &:last-child {
    margin-right: 0.5em;
  }
}

.flex {
  flex-wrap: wrap;
}

</style>
