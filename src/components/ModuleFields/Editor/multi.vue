<template>
  <div>
    <div v-if="singleInput" class="mb-2">
      <slot name="single"></slot>
    </div>
    <draggable :list.sync="val" handle=".handle">
      <div v-for="(v, index) of val" :key="index" class="mb-1">
        <b-row class="align-items-center">
          <b-col cols="12" class="d-flex align-items-center">
            <font-awesome-icon v-b-tooltip.hover
                              :icon="['fas', 'bars']"
                              :title="$t('general.tooltip.dragAndDrop')"
                              class="handle text-light mr-3" />
            <slot v-bind:index="index" class="mr-2"></slot>
            <font-awesome-icon v-if="removable"
                               :icon="['fas', 'times']"
                               @click="removeValue(index)"
                               class="pointer text-danger ml-auto mr-1" />
          </b-col>
        </b-row>
      </div>
    </draggable>
    <b-row v-if="!singleInput" no-gutters class="mt-2" >
      <b-col cols="5">
        <b-button @click="val.push('')"
                  variant="primary"
                  size="sm">
          +
          {{ $t('general.label.addValue') }}
        </b-button>
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
