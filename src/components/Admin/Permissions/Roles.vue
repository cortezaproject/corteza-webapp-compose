<template>
  <b-row no-gutters class="roles">
    <b-col class="role-list" cols="3">
      <b-list-group>
        <b-list-group-item
          v-for="r in roles" :key="r.roleID"
          :class="{ 'active-role': r.roleID === currentRole.roleID, 'role': true }"
          active-class="active-role"
          @click="switchRole(r)" >

          {{ r.name || r.handle || r.roleID || $t('role.unnamed') }}
        </b-list-group-item>
      </b-list-group>
    </b-col>
    <b-col class="rule-list" cols="9">
      <per-role
        v-if="isRoleSelected"
        :roleTitle="getRoleTitle"
        :roleID="getRoleID"
        :filter="filter"
        :targetID="targetID"
        :targetTitle="targetTitle"/>
    </b-col>
  </b-row>
</template>

<script>
import PerRole from '@/components/Admin/Permissions/PerRole'

export default {
  components: {
    PerRole,
  },

  props: {
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
      query: '',
      roles: [],
      currentRole: {},
    }
  },

  computed: {
    title () {
      return this.$t('role.managePermissions')
    },

    isRoleSelected () {
      return this.getRoleID
    },

    getRoleTitle () {
      return this.currentRole.name || this.currentRole.handle || this.currentRole.roleID || this.$t('role.unnamed')
    },

    getRoleID () {
      return this.currentRole.roleID || ''
    },
  },

  created () {
    this.fetchRoles()
  },

  methods: {
    fetchRoles () {
      this.$system.roleList({ query: this.query.toLowerCase() }).then(rr => {
        this.roles = rr
        this.currentRole = this.roles[0]
      })
    },
    switchRole (role) {
      this.currentRole = role
    },
  },
}
</script>

<style>
.list-group-item {
  border: 0;
  cursor: pointer;
}

.list-group-item:first-child {
  border-radius: 0;
}

.list-group-item:last-child {
  border-radius: 0;
}
</style>

<style scoped lang="scss">
@import '@/assets/sass/_0.commons.scss';

.roles {
  height: 50vh;
  overflow: hidden;
  text-align: left;
}

.role {
  white-space: normal;
  word-wrap: break-word;
  line-height: 2;
}

.active-role {
  border-right: 3px solid;
  border-color: #1397cb;
  background-color: rgba(19, 151, 203, 0.15);
  color: #1397cb;
}

.rule-list {
  height: 50vh;
  border-left: 3px solid $appcream;
  border-radius: 0;
  line-height: 1.5;
}

.role-list {
  height: 50vh;
  overflow: hidden;
  overflow-y: auto;
  padding: 0;
}
</style>
