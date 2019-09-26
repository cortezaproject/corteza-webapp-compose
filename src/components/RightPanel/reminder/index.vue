<template>
  <div>
    <list v-if="!edit"
          :reminders="reminders"
          @edit="onEdit"
          @dismiss="onDismiss" />

    <edit v-else
          :edit="edit"
          :myID="$auth.user.userID"
          :users="users"
          @save="onSave"
          @cancel="onCancel" />

  </div>
</template>

<script>
import List from './List'
import Edit from './Edit'
import { mapGetters } from 'vuex'
import Reminder from 'corteza-webapp-common/src/lib/types/shared/reminder'

export default {
  components: {
    List,
    Edit,
  },

  props: {
    namespaceID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      reminders: [],
      edit: null,
    }
  },

  computed: {
    ...mapGetters({
      users: 'user/set',
    }),
  },

  created () {
    this.fetchReminders()
    // @todo remove this, when sockets get implemented
    this.$root.$on('reminders.pull', this.fetchReminders)
    this.$root.$on('reminder.updated', this.fetchReminders)
    this.$root.$on('reminder.create', this.onEdit)
  },

  beforeDestroy () {
    this.$root.$off('reminders.pull', this.fetchReminders)
    this.$root.$off('reminder.updated', this.fetchReminders)
    this.$root.$off('reminder.create', this.onEdit)
  },

  methods: {
    onEdit ({ reminderID, resource, assignedTo, payload = {} } = {}) {
      if (reminderID) {
        this.edit = this.reminders.find(r => r.reminderID === reminderID)
      } else {
        this.edit = {
          resource: resource || `namespace:${this.namespaceID}`,
          assignedTo: assignedTo || this.$auth.user.userID,
          payload,
        }
      }
    },

    onSave (r) {
      let h = 'reminderCreate'
      if (r.reminderID) {
        h = 'reminderUpdate'
      }
      this.$SystemAPI[h](r).then(r => {
        this.reminders.push(new Reminder(r))
      })

      this.onCancel()
    },

    onCancel () {
      this.edit = null
    },

    onDismiss (r) {
      this.$SystemAPI.reminderDismiss(r).then(() => {
        this.fetchReminders()
      })
    },

    fetchReminders () {
      this.$SystemAPI.reminderList({
        assignedTo: this.$auth.user.userID,
        perPage: 0,
      }).then(({ set = [] }) => {
        this.reminders = set.map(r => new Reminder(r))
      })
    },
  },

}
</script>
