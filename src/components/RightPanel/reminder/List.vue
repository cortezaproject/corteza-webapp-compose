<template>
  <div>
    <h5 class="sticky-top bg-white p-1">
      {{ $t('general.reminder.listLabel') }}
    </h5>

    <!-- Active reminders -->
    <b-form-group class="p-2">
      <b-form v-for="r in remindersActive"
              :key="r.reminderID"
              class="d-flex align-items-baseline">

        <span class="flex-grow-1 text-dark d-flex align-items-center reminder">
          <b-form-checkbox size="sm"
                           name="some-radios"
                           class="checkbox"
                           @change="dismiss($event, r)" />

          {{ r.payload.title }}
        </span>

        <font-awesome-icon v-if="r.remindAt"
                           :icon="['far', 'bell']"
                           class="mr-1 small"
                           v-b-tooltip.hover
                           :title="makeTooltip(r)" />

        <font-awesome-icon v-if="r.snoozeCount"
                           :icon="['far', 'clock']"
                           class="mr-1 small" />

        <!-- @note currently, edit is disabled -->
        <!-- <b-button variant="link"
                  class="p-0"
                  @click="$emit('edit', r)">

          <font-awesome-icon :icon="['far', 'edit']" class="text-primary" />
        </b-button> -->
      </b-form>
    </b-form-group>

    <!-- Dismissed reminders -->
    <b-list-group class="p-2 pb-5">
      <b-form v-for="r in remindersDismissed"
              :key="r.reminderID"
              class="d-flex align-items-baseline">

        <b-form-checkbox size="sm"
                         name="some-radios"
                         class="flex-grow-1"
                         disabled
                         :checked="true">
          <s>{{ r.payload.title }}</s>
        </b-form-checkbox>
      </b-form>
    </b-list-group>

    <div class="position-sticky text-center bg-white py-1" style="bottom: 0;">
      <b-button @click="$emit('edit')">
        + {{ $t('general.reminder.add') }}
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reminders: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  computed: {
    remindersActive () {
      return this.reminders
        .filter(({ dismissedAt }) => !dismissedAt)
        .sort(this.stdSort)
    },
    remindersDismissed () {
      return this.reminders
        .filter(({ dismissedAt }) => dismissedAt)
        .sort(this.stdSort)
    },
  },

  methods: {
    dismiss (checked, r) {
      if (checked) {
        this.$emit('dismiss', r)
      }
    },

    stdSort (a, b) {
      if (!a.remindAtTime) {
        return -1
      }
      if (!b.remindAtTime) {
        return 0
      }

      return a.remindAtTime.diff(b.remindAtTime, 'ms')
    },

    makeTooltip ({ remindAtTime }) {
      return remindAtTime.format('DD. MM. YYYY hh:mm')
    },
  },
}
</script>

<style lang="scss" scoped>
.reminder {
  .checkbox {
    opacity: 0;
    transition: opacity 0.1s;
  }

  &:hover .checkbox {
    opacity: 1;
  }
}

</style>
