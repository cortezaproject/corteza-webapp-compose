<template>
  <div>
    <div v-if="singleInput" class="mb-2">
      <slot name="single"></slot>
    </div>
    <draggable :list.sync="val" handle=".handle">
      <div v-for="(v, index) of val" :key="index" class="mb-1">
        <b-row no-gutters>
          <b-col cols="1" class="text-center my-auto pr-3">
            <font-awesome-icon v-b-tooltip.hover
                              :icon="['fas', 'sort']"
                              :title="$t('general.tooltip.dragAndDrop')"
                              class="handle text-secondary" />
          </b-col>

          <b-col cols="10">
            <slot v-bind:index="index"></slot>
          </b-col>

          <b-col v-if="removable" cols="1" class="text-center my-auto pl-3">
            <font-awesome-icon :icon="['fas', 'times']"
                               @click="removeValue(index)"
                               class="pointer text-secondary" />
          </b-col>
        </b-row>
      </div>
    </draggable>
    <b-row v-if="!singleInput" no-gutters class="mt-2" >
      <b-col cols="1" @click="val.push('')" class="text-center my-auto pr-3 h5 text-secondary pointer">
        +
      </b-col>
      <b-col cols="5">
        <b-button @click="val.push('')" variant="link" class="p-0">{{ $t('general.label.addValue') }}</b-button>
      </b-col>
    </b-row>
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

    removable: {
      type: Boolean,
      default: true,
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
    removeValue (index) {
      if (index > -1) {
        this.val.splice(index, 1)
      }
    },
  },

}
</script>
<style lang="scss" scoped>
.handle {
  cursor: grab;
}

.pointer {
  cursor: pointer;
}
</style>
