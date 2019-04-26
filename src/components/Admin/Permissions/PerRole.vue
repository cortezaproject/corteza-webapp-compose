<template>
  <b-form @submit.prevent="onSubmit">
    <div class="rules">
      <table cellspacing="0" cellpadding="0" border="0">
        <permission-group :title="roleTitle" :permissions="filtered('compose')" />
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
import PermissionGroup from '@/components/Admin/Permissions/PermissionGroup'

export default {
  components: {
    PermissionGroup,
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
      const filterParts = this.filter.trim().toLocaleLowerCase().split(/\s+/)

      const has = ({ resource, operation, title, description, value }) => {
        if (!filterParts) {
          return true
        }

        const idx = `${resource} ${operation} ${title} ${description} ${value}`.toLocaleLowerCase()

        // No namespace rules
        if (idx.indexOf('namespace') >= 0) {
          return false
        }

        for (const fp of filterParts) {
          if (idx.indexOf(fp) === -1) {
            return false
          }
        }

        return true
      }

      return (prefix) => this.rules.filter(p => (!prefix || p.resource.indexOf(prefix) === 0) && (has(p)))
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
      return {
        ...p,
        title: this.$t(`${tString}.title`),
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
