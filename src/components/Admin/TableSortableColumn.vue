<template>
  <th @click="sort(!ascending)">
    {{ label || name }}
    <span v-if="!sortDisabled">
      <font-awesome-icon v-if="ascending === undefined" :icon="['fas', 'sort']"></font-awesome-icon>
      <font-awesome-icon v-else-if="ascending" :icon="['fas', 'sort-up']"></font-awesome-icon>
      <font-awesome-icon v-else-if="!ascending" :icon="['fas', 'sort-down']"></font-awesome-icon>
    </span>
  </th>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    ascending: {
      type: [Boolean, Function],
    },

    sortDisabled: {
      type: Boolean,
      default: false,
    },
  },

  created () {
    if (this.ascending !== undefined) this.sort(this.ascending)
  },

  methods: {
    sort (asc) {
      const fieldObject = {
        name: this.name,
        ascending: typeof asc === 'function' ? asc(this.name, true) : asc,
      }
      this.$emit('sort', fieldObject)
    },
  },
}
</script>

<style scoped>
th {
  padding-left: 5px;
  cursor: pointer;
}
</style>
