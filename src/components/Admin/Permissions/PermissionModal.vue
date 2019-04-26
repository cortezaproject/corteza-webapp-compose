<template>
  <b-modal
    :id="id"
    :title="getTitle"
    hide-footer
    size="xl"
    lazy>

    <roles :filter="filter" :targetID="getTargetID" />
  </b-modal>
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
      return this.$t('permission.setFor', { target })
    },
  },
}
</script>

<style>
.modal .modal-xl {
  margin-top: 20px;
  min-width: 550px;
}

.modal-xl .modal-body {
  padding: 0;
}

.modal {
  padding: 0;
}

.modal-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header {
  align-items: center;
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
