<template>
  <div>
    <div v-if="singleInput" class="mb-2">
      <slot name="single"></slot>
    </div>
    <draggable :list.sync="val">
      <div v-for="(v, index) of val" :key="index">
        <b-row no-gutters>
          <b-col cols="1" class="center my-auto">
            <font-awesome-icon v-b-tooltip.hover
                              :icon="['fas', 'sort']"
                              :title="$t('general.tooltip.dragAndDrop')"
                              class="handle text-secondary" />
          </b-col>

          <b-col cols="10">
            <slot v-bind:index="index"></slot>
          </b-col>

          <b-col cols="1" @click="removeValue(v)" class="center my-auto">
            <font-awesome-icon :icon="['fas', 'times']"
                              class="text-secondary" />
          </b-col>
        </b-row>
      </div>
    </draggable>
    <b-button v-if="!singleInput" @click="val.push('')" variant="link" class="pl-0">+ {{ $t('general.label.addValue') }}</b-button>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },

  props: {
    value: {
      type: Array,
      required: true,
      default: () => [],
    },

    singleInput: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    val: {
      get () {
        return this.value
      },

      set (val) {
        this.$emit('update:value', val)
      },
    },
  },

  methods: {
    removeValue (value) {
      this.val = this.val.filter(v => v !== value)
    },
  },

}
</script>
<style lang="scss" scoped>
.center {
  width: 100%;
  text-align: center;
}

.handle {
  cursor: grab;
}
</style>
