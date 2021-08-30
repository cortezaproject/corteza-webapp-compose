<template>
  <div
    class="d-flex"
  >
    <font-awesome-icon
      :icon="['fas', 'grip-vertical']"
      class="handle align-baseline mt-1 mr-3 text-primary"
    />
    <b
      class="cursor-default text-dark text-truncate"
    >
      {{ fieldLabel }}
    </b>
    <small
      v-if="field.isSystem"
      class="cursor-default ml-auto pt-1 text-truncate"
    >
      {{ $t('selector.systemField') }}
    </small>
    <font-awesome-icon
      v-if="isSelected"
      :icon="['far', 'eye']"
      class="align-baseline mt-1 ml-auto text-muted pointer"
      @click="$emit('unselect-field', field)"
    />
    <font-awesome-icon
      v-else
      :icon="['fas', 'eye-slash']"
      class="align-baseline mt-1 ml-auto text-muted pointer"
      @click="$emit('select-field', field)"
    />
  </div>
</template>

<script>
export default {
  i18nOptions: {
    namespaces: 'field',
  },

  name: 'FieldItem',

  props: {
    field: {
      type: Object,
      required: true,
    },

    isSelected: {
      type: Boolean,
      required: true,
    },

    selectedFields: {
      type: Array,
      required: true,
    },
  },

  computed: {
    fieldLabel () {
      let fieldLabel = this.field.name || ''

      if (this.field.label) {
        fieldLabel = `${this.field.label} (${this.field.name})`
      }

      fieldLabel += this.field.isRequired ? ' *' : ''
      return fieldLabel
    },
  },
}
</script>
<style scoped>
.handle {
  cursor: grab;
}

.cursor-default {
  cursor: default;
}
</style>
