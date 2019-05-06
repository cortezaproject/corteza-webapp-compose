<template>
  <tr>
    <td class="buttons">
      <permission-value
        v-model="value"
        :current="current"
        :enabled="enabled"
        v-on="$listeners"/>

    </td>
    <td class="text">
      <b v-html="title"/>
      <div>{{ description }}</div>
    </td>
    <td class="short">
      <b-button
        variant="link"
        @click="$emit('update:value', current)"
        v-show="isChanged">

        {{ $t('permission.resetBack', {current}) }}
      </b-button>
    </td>
  </tr>
</template>

<script>
import PermissionValue from '@/components/Admin/Permissions/PermissionValue'

export default {
  components: {
    PermissionValue,
  },

  props: {
    resource: {
      type: String,
      required: true,
    },

    operation: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: false,
    },

    description: {
      type: String,
      required: false,
    },

    default: {
      type: String,
      required: false,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    value: {
      type: String,
      required: false,
    },

    current: {
      type: String,
      required: false,
    },
  },

  computed: {
    isChanged () {
      return this.value !== this.current
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/sass/_0.commons.scss';

td {
  border-top: none;
  height: 40px;
  word-break: break-word;
  padding: 5px;
  vertical-align: top;
  border: none;

  &.buttons {
    width: 170px;
    text-align: center;
    vertical-align: middle;

    div {
      margin: auto;
    }
  }

  &.short {
    vertical-align: middle;
    text-align: right;
    width: 100px;
  }

  &.text {
    div {
      font-size: 10px;
    }
  }
}
</style>
