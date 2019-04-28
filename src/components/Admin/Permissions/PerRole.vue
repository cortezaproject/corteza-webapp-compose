<template>
  <b-form @submit.prevent="onSubmit">
    <div class="rules">
      <table cellspacing="0" cellpadding="0" border="0">
        <transition-group name="list" tag="tbody">
          <permission
            v-for="p in filtered('compose')"
            :key="p.resource + p.operation"
            v-bind="p"
            :value.sync="p.value"
            v-on="$listeners"/>

        </transition-group>
      </table>
    </div>

    <div class="footer">
      <b-button type="submit" variant="primary" :disabled="!submittable">
        {{ $t('permission.saveChanges') }}
      </b-button>
    </div>
  </b-form>
</template>

<script>
import Permission from '@/components/Admin/Permissions/Permission'

export default {
  components: {
    Permission,
  },

  props: {
    roleID: {
      type: String,
      required: true,
    },
    roleTitle: {
      type: String,
      required: true,
    },
    filter: {
      type: String,
      required: true,
    },
    targetID: {
      type: String,
      required: true,
    },
    targetTitle: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      processing: true,

      rules: [],
      permissions: [],
    }
  },

  computed: {
    filtered () {
      return (prefix) => this.rules.filter(p => (!prefix || p.resource.indexOf(prefix) === 0) && p.resource.indexOf(this.filter) > 0)
    },

    dirty () {
      return this.collectChangedRules().length > 0
    },

    submittable () {
      return this.dirty && !this.processing
    },
  },

  watch: {
    roleID: {
      handler () {
        this.rules = []
        this.fetchRules()
      },
    },
  },

  created () {
    this.fetchPermissionsList().then(() => {
      this.fetchRules()
    })
  },

  methods: {
    fetchPermissionsList () {
      this.processing = true
      return this.$system.permissionsList().then((pp) => {
        this.permissions = pp
          .map(this.describePermission)
          .map(this.appendWildcard)

        this.processing = false
      })
    },

    fetchRules () {
      this.processing = true
      return this.$system.permissionsRead({ roleID: this.roleID }).then((rules) => {
        this.setCurrentRules(rules)
        this.processing = false
      })
    },

    onSubmit () {
      this.processing = true
      const permissions = this.collectChangedRules()
      return this.$system.permissionsUpdate({ roleID: this.roleID, permissions }).then((rules) => {
        this.setCurrentRules(rules)
        this.processing = false
      })
    },

    collectChangedRules () {
      return this.rules.filter(r => r.value !== r.current).map(({ resource, operation, value }) => {
        return { resource, operation, value }
      })
    },

    setCurrentRules (rules) {
      const findCurrent = ({ resource, operation }) => {
        return (rules.find(r => r.resource === resource && r.operation === operation) || {}).value || 'inherit'
      }

      this.rules = this.permissions.map((p) => {
        const current = findCurrent(p)
        return { ...p, value: current, current }
      })
    },

    setAllFiltered (value) {
      this.filtered().forEach(rule => {
        rule.value = value
      })
    },

    describePermission (p) {
      let { resource, operation } = p
      resource = resource.replace(/:/g, '-')
      operation = operation.replace(/\./g, '-')

      if (resource.slice(-1) === '-') {
        resource = resource.slice(0, -1)
      }

      const tString = `permission.${resource}.${operation}`
      let permissionTitle = this.$t(`${tString}.title`)
      if (this.targetID) {
        permissionTitle = this.$t(`${tString}.specific`, { target: this.targetTitle })
      }
      return {
        ...p,
        title: permissionTitle,
        description: this.$t(`${tString}.description`),
      }
    },

    // Append wildcard to all resources that have more than 1 level
    appendWildcard (p) {
      if (p.resource.split(':').length > 1) {
        if (this.targetID) {
          p.resource += this.targetID
        } else {
          p.resource += '*'
        }
      }

      return p
    },
  },
}
</script>
<style scoped lang="scss">
@import '@/assets/sass/_0.commons.scss';

.btn {
  border-radius: 0;
}

table tbody tr:nth-of-type(odd) {
  background-color: #fff;
}

th {
  color: $appgrey;
  font-size: 20px;
  padding: 10px 9px;
  border-top: 0;
}

.list-enter-active,
.list-leave-active,
.list-move {
  transition: 200ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  transition-property: opacity, transform;
}

.list-enter {
  opacity: 0;
  transform: translateX(50px) scaleY(0.5);
}

.list-enter-to {
  opacity: 1;
  transform: translateX(0) scaleY(1);
}

.list-leave-active {
  position: absolute;
}

.list-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center top;
}

form {
  display: flex;
  flex-direction: column;
  height: 50vh;

  .rules {
    flex: 1;
    flex-grow: 100;
    text-align: left;
    height: 40vh;
    overflow-y: auto;
    overflow-x: hidden;

    th {
      padding: 10px;
    }

    table {
      width: 100%;
    }
  }

  .footer {
    flex: 1;
    padding: 1rem;
    text-align: right;
    height: 10vh;
    bottom: 0;
  }
}
</style>
