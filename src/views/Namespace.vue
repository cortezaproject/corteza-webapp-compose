<template>
  <div class="centering-wrap inactive-area d-flex" v-if="$auth.is()">
    <small
      class="p-1 text-secondary position-absolute version"
    >
      {{ frontendVersion }}
    </small>
    <c-toaster
      :toasts="toasts"
    />
    <div class="alert-holder">
      <b-alert v-for="(a,i) in alerts"
               :variant=" a.variant || 'info'"
               :key="'alert:'+i"
               :show="a.countdown"
               dismissible
               @dismiss-count-down="a.countdown=$event"
               @dismissed="alerts.splice(i, 0)">{{ a.message }}</b-alert>
    </div>
    <div class="d-none d-md-block">
      <namespace-sidebar
        :namespaces="enabledNamespaces"
        v-if="showNamespaceSidebar"
        :namespace="namespace"
        :visible.sync="nsSbVisible"
      />
    </div>
    <router-view
      v-if="loaded && namespace"
      :namespace="namespace"
    />
    <div class="loader" v-else>
      <div>
        <h1 class="mt-5 text-center">{{ namespace ? (namespace.name || namespace.slug || namespace.ID) : '...' }}</h1>
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
    <div class="error text-danger text-center position-absolute" v-if="error">{{ error }}</div>
    <c-permissions-modal />
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import NamespaceSidebar from '../components/Namespaces/NamespaceSidebar'
import { compose } from '@cortezaproject/corteza-js'
import { components } from '@cortezaproject/corteza-vue'
const { CPermissionsModal, CToaster } = components

export default {
  name: 'Namespace',

  components: {
    CToaster,
    CPermissionsModal,
    NamespaceSidebar,
  },

  props: {
    slug: {
      required: true,
      type: String,
    },
  },

  data () {
    return {
      nsSbVisible: this.$s('UI.NamespaceSwitcher.DefaultOpen', false),
      loaded: false,

      error: '',
      alerts: [], // { variant: 'info', message: 'foo' },
      namespace: null,
      namespaces: [],
      toasts: [],
    }
  },

  computed: {
    ...mapGetters({
      namespacePending: 'namespace/pending',
      modulePending: 'module/pending',
      chartPending: 'chart/pending',
      pagePending: 'page/pending',
    }),

    parts () {
      return {
        namespace: this.namespacePending,
        module: this.modulePending,
        page: this.pagePending,
        chart: this.chartPending,
      }
    },

    frontendVersion () {
      /* eslint-disable no-undef */
      return VERSION
    },

    enabledNamespaces () {
      return this.namespaces.filter(({ enabled }) => enabled)
    },

    showNamespaceSidebar () {
      return this.$s('UI.NamespaceSwitcher.Enabled', false) && this.enabledNamespaces.length > 1
    },
  },

  watch: {
    slug: {
      immediate: true,
      handler (slug) {
        this.loaded = false
        this.$auth.check().then((user) => {
          if (!user) {
            // check performed: no error & no user,
            // redirect to auth
            throw new Error()
          }
          this.initReminders()

          this.$store.dispatch('namespace/load').then(() => {
            const ns = this.$store.getters['namespace/getByUrlPart'](slug)
            if (ns) {
              return ns
            }
            return this.$store.dispatch('namespace/load', { force: true }).then(() => {
              return this.$store.getters['namespace/getByUrlPart'](slug)
            })
          }).then(namespace => {
            this.namespace = namespace
          }).catch(this.errHandler)
        }).catch(() => {
          this.$auth.open()
        })
      },
    },

    // When namespace changes, reload modules, charts & pages
    namespace: {
      handler (namespace) {
        if (!namespace) {
          return
        }

        const p = { namespace, namespaceID: namespace.namespaceID, clear: true }

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
    },
  },

  created () {
    this.error = ''
    this.handleAlert((alert) => this.alerts.push(alert))
    this.$root.$on('namespaces.listLoad', this.namespaceLoader)
    this.$root.$on('reminder.show', this.showReminder)

    this.namespaceLoader()
      .catch(this.errHandler)
  },

  beforeDestroy () {
    this.$Reminder.stop()
    this.$root.$off('namespaces.listLoad', this.namespaceLoader)
    this.$root.$off('reminder.show', this.showReminder)
  },

  methods: {
    async namespaceLoader () {
      return this.$ComposeAPI.namespaceList().then(({ set }) => {
        this.namespaces = set.map(ns => new compose.Namespace(ns))
      })
    },

    initReminders () {
      this.$nextTick(() => {
        this.$Reminder.init({
          emitter: this.$root,
          filter: {
            assignedTo: this.$auth.user.userID,
            scheduledOnly: true,
            excludeDismissed: true,
          },
        })
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

    removeToast (id) {
      const i = this.toasts.findIndex(r => r.id === id)
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
      const i = this.toasts.findIndex(({ id }) => id === r.id)
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

      r.addAction('dismiss', {
        cb: this.onReminderHide,
        kind: 'Button',
        label: `<b>${this.$t('general.reminder.dismiss')}</b>`,
        options: {
          variant: 'warning',
          class: ['float-right'],
        },
      })

      r.addAction('snooze', {
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
      })

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
.alert-holder {
  position: absolute;
  width: 100%;
  top: 55px;

  .alert {
    z-index: 1;
    box-shadow: 0 0 2px 0 rgba($secondary, 0.75);
  }
}

.error {
  font-size: 24px;
  background-color: $white;
  width: 100vw;
  height: 20vh;
  padding: 60px;
  top: 40vh;
}

.version {
  bottom: 0;
  right: 0;
}
</style>
