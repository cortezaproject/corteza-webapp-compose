<template>
  <li
    class="d-flex mt-1 mx-1"
  >
    <b-button
      class="flex-grow-1"
      @click="$emit('prev')"
      :disabled="!hasPrevPage"
      size="sm"
    >
      <font-awesome-icon
        :icon="['fas', 'chevron-left']"
      />
    </b-button>
    <b-button
      class="flex-grow-1 ml-1"
      @click="$emit('next')"
      :disabled="!hasNextPage"
      size="sm"
    >
      <font-awesome-icon
        :icon="['fas', 'chevron-right']"
      />
    </b-button>
  </li>
</template>

<script>
export default {
  props: {
    hasPrevPage: {
      type: Boolean,
      required: true,
    },

    hasNextPage: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
