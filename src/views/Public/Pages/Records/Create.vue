<template>
  <div class="view">
    <div class="editor">
      <button class="btn-url" @click.prevent="$router.back()">&#171; Back</button>
      <button class="btn" @click.prevent="$router.push({ name: 'public.page.record.create' })">+ Add new</button>
      <button class="btn btn-blue" @click="handleCreate">Save changes</button>
    </div>
    <grid :page="page" :record="record" v-if="record" edit-mode />
  </div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'
import triggerRunner from '@/mixins/trigger_runner'
import Record from '@/lib/record'

export default {
  name: 'CreateRecord',

  props: {
    // Receives page object via router-view component
    page: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      record: null,
    }
  },

  created () {
    this.record = new Record(this.page.module, {})
  },

  methods: {
    handleCreate () {
      this.createRecord(this.page.module, this.record)
    },
  },

  components: {
    Grid,
  },

  mixins: [
    triggerRunner,
  ],
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/_0.declare.scss";

.alert {
  position: absolute;
  z-index: 1;
  width: 100%;
  box-shadow: 0 0 2px 0 rgba($appgrey, 0.75);
}

.btn {
  margin-right: 0.5em;
}
</style>
