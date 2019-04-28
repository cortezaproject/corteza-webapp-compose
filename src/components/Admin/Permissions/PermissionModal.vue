<template>
  <span>
    <a v-b-modal="id" class="action">
      <i class="action icon-fatlock" />
    </a>

    <b-modal
      :id="id"
      :title="$t('permission.setFor', { target: getTitle })"
      hide-footer
      size="permission"
      lazy>

      <roles :filter="filter" :targetID="getTargetID" :targetTitle="getTitle" />
    </b-modal>
  </span>
</template>

<script>
import Roles from '@/components/Admin/Permissions/Roles'

export default {
  components: {
    Roles,
  },

  props: {
    id: {
      type: String,
      required: true,
    },

    filter: {
      type: String,
      required: true,
    },

    targetAll: {
      type: Boolean,
      required: false,
      default: false,
    },

    target: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  computed: {
    getTargetID () {
      if (this.targetAll) {
        return ''
      }
      return this.target[`${this.filter}ID`]
    },
    getTitle () {
      let target = ''
      if (this.targetAll) {
        target = this.$t(`permission.all.${this.filter}`)
      } else {
        target = this.target.name || this.target.title
      }
      return target
    },
  },
}
</script>

<style>
.modal .modal-permission {
  max-width: 50%;
  width: 50%;
}

.modal-permission .modal-body {
  padding: 0;
}

.modal-permission .modal-content {
  min-width: 720px;
}
</style>

<style scoped>
.btn {
  border-radius: 0;
}

.title {
  display: inline-block;
  vertical-align: middle;
}
</style>
