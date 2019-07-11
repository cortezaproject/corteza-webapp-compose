<template>
  <div>
    <draggable :list.sync="val">
      <b-input-group v-for="(v, index) of val" :key="index">
        <b-input-group-text>
            <font-awesome-icon v-b-tooltip.hover
                              :icon="['fas', 'sort']"
                              :title="$t('general.tooltip.dragAndDrop')"
                              class="handle text-secondary" />
        </b-input-group-text>

        <slot v-bind:index="index"></slot>

        <b-input-group-text @click="removeValue(v)">
            <i class="icon-cross text-secondary"></i>
        </b-input-group-text>
      </b-input-group >
    </draggable>
    <b-button @click="val.push('')" variant="link" class="pl-0">+ {{ $t('general.label.addValue') }}</b-button>
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
.handle {
  cursor: grab;
}
</style>
