<template>
  <div>
    <div v-if="singleInput" class="mb-2">
      <slot name="single"></slot>
    </div>
    <draggable
      :list.sync="val"
      handle=".handle"
    >
      <div
        v-for="(v, index) of val"
        :key="index"
        class="d-flex w-100 align-items-center mb-1"
      >
        <font-awesome-icon
          v-b-tooltip.hover
          :icon="['fas', 'bars']"
          :title="$t('general.tooltip.dragAndDrop')"
          class="handle text-light ml-1 mr-2"
        />

        <slot
          v-bind:index="index"
          class="flex-shrink-1"
        />

        <font-awesome-icon
          v-if="removable"
          :icon="['fas', 'times']"
          @click="removeValue(index)"
          class="pointer text-danger ml-2 mr-1"
        />
      </div>
    </draggable>
    <b-button
      v-if="!singleInput"
      variant="primary"
      size="sm"
      :class="{ 'mt-2': val.length }"
      @click="val.push(undefined)"
    >
      + {{ $t('general.label.addValue') }}
    </b-button>
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
