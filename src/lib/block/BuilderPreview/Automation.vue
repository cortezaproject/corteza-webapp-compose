<template>
  <div>
    <b-button v-for="(b) in options.buttons"
              :key="b.triggerID"
              variant="dark"
              disabled>{{ b.label }}
     </b-button>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

.btn {
  border-radius: 0;
  margin-bottom: 5px;
}

</style>
