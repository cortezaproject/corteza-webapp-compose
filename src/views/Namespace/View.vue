<template>
  <div
    class="d-flex w-100"
  >
    <c-toaster
      :toasts="toasts"
    />

    <router-view
      v-if="loaded && namespace"
      :namespace="namespace"
    />

    <div
      v-else
      class="loader flex-column w-100 h-100"
    >
      <div>
        <div class="logo w-100" />
        <h1 class="text-center">
          {{ namespace ? (namespace.name || namespace.slug || namespace.namespaceID) : '...' }}
        </h1>
        <div>
          <div
            v-for="(pending, part) in parts"
            :key="part"
            class="p-1"
          >
            <div
              class="pending pr-3 d-inline-block text-right"
            >
              <b-spinner
                v-if="pending"
                small
              />
              <font-awesome-icon
                v-else
                :icon="['fas', 'check']"
              />
            </div>
            <div
              class="d-inline-block"
            >
              {{ $t('navigation.' + part) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { components } from '@cortezaproject/corteza-vue'
const { CToaster } = components

export default {
  name: 'Namespace',

  components: {
    CToaster,
  },

  props: {
    slug: {
      required: true,
      type: String,
    },
  },

  data () {
    return {
      loaded: false,

      error: '',
      namespace: null,
      toasts: [],
    }
  },

  computed: {
    ...mapGetters({
      namespacePending: 'namespace/pending',
      namespaces: 'namespace/set',
      modulePending: 'module/pending',
      chartPending: 'chart/pending',
      pagePending: 'page/pending',
      pages: 'page/set',
    }),

    parts () {
      return {
        namespace: this.namespacePending,
        module: this.modulePending,
        page: this.pagePending,
        chart: this.chartPending,
      }
    },
  },

  watch: {
    slug: {
      immediate: true,
      handler (slug) {
        this.loaded = false

        let namespace = this.$store.getters['namespace/getByUrlPart'](slug)

        if (!namespace) {
          this.$store.dispatch('namespace/load', { force: true }).then(() => {
            namespace = this.$store.getters['namespace/getByUrlPart'](slug)
          }).catch(this.errHandler)
        }

        this.namespace = namespace
        this.prepareNamespace()
      },
    },
  },

  created () {
    this.error = ''
    this.$root.$on('reminder.show', this.showReminder)
  },

  beforeDestroy () {
    this.$root.$off('reminder.show', this.showReminder)
  },

  methods: {
    prepareNamespace () {
      if (!this.namespace) {
        this.$router.push({ name: 'root' })
        return
      }

      if (!this.namespace.enabled) {
        this.toastDanger(this.$t('notification.namespace.disabled'))
        this.$router.push({ name: 'root' })
        return
      }

      const p = { namespace: this.namespace, namespaceID: this.namespace.namespaceID, clear: true }

      this.$store.dispatch('module/clearSet')
      this.$store.dispatch('chart/clearSet')
      this.$store.dispatch('page/clearSet')

      // Preload all data we need.
      Promise.all([
        this.$store.dispatch('module/load', p)
          .catch(this.errHandler),

        this.$store.dispatch('chart/load', p)
          .catch(this.errHandler),

        this.$store.dispatch('page/load', p)
          .catch(this.errHandler),

      ]).catch(this.errHandler).then(() => {
        this.loaded = true
      })
    },

    // Error handler for Promise
    errHandler (error) {
      switch ((error.response || {}).status) {
        case 403:
          this.error = this.$t('notification.general.composeAccessNotAllowed')
      }

      return Promise.reject(error)
    },

    removeToast (reminderID) {
      const i = this.toasts.findIndex(r => r.reminderID === reminderID)
      if (i > -1) {
        this.toasts.splice(i, 1)
      }
    },

    onReminderHide ({ reminderID }) {
      // Dismiss
      this.$SystemAPI.reminderDismiss({ reminderID })
        .then(() => {
          this.removeToast(reminderID)
          this.$root.$emit('reminder.updated', reminderID)
        })
    },

    // Duration is in ms
    onReminderSnooze ({ reminderID }, { duration }) {
      const remindAt = moment().add(duration, 'ms').toISOString()
      this.$SystemAPI.reminderSnooze({ reminderID, remindAt })
        .then(() => {
          this.removeToast(reminderID)
          this.$root.$emit('reminder.updated', reminderID)
        })
    },

    showReminder (r) {
      const i = this.toasts.findIndex(({ reminderID }) => reminderID === r.reminderID)
      if (i > -1 && (!r.editedAt || r.editedAt === this.toasts[i].editedAt)) {
        // Same reminder; no need to push it again
        return
      }

      r.options = {
        variant: 'warning',
        'no-auto-hide': true,
        solid: true,
        ...r.options,
      }

      r.actions.dismiss = {
        cb: this.onReminderHide,
        kind: 'Button',
        label: `<b>${this.$t('general.reminder.dismiss')}</b>`,
        options: {
          variant: 'warning',
          class: ['float-right'],
        },
      }

      r.actions.snooze = {
        cb: this.onReminderSnooze,
        label: `<b>${this.$t('general.reminder.snooze')}</b>`,
        kind: 'Select',
        options: {
          variant: 'outline-warning',
          class: ['float-left'],
          items: [
            { kind: 'item-button', label: this.$t('general.label.timeMinute', { t: 5 }), value: { duration: 1000 * 60 * 5 } },
            { kind: 'item-button', label: this.$t('general.label.timeMinute', { t: 15 }), value: { duration: 1000 * 60 * 15 } },
            { kind: 'item-button', label: this.$t('general.label.timeMinute', { t: 30 }), value: { duration: 1000 * 60 * 30 } },
            { kind: 'item-button', label: this.$t('general.label.timeHour', { t: 1 }), value: { duration: 1000 * 60 * 60 * 1 } },
            { kind: 'item-button', label: this.$t('general.label.timeHour', { t: 2 }), value: { duration: 1000 * 60 * 60 * 2 } },
            { kind: 'item-button', label: this.$t('general.label.timeHour', { t: 24 }), value: { duration: 1000 * 60 * 60 * 24 } },
          ],
        },
      }

      if (i > -1) {
        this.toasts.splice(i, 1, r)
      } else {
        this.toasts.push(r)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.error {
  font-size: 24px;
  background-color: $white;
  width: 100vw;
  height: 20vh;
  padding: 60px;
  top: 40vh;
}
</style>
