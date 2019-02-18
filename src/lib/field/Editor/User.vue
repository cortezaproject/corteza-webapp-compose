<template>
  <b-form-group :label="field.label || field.name">
    <vue-select :options="users"
                @search="search"
                option-value="userID"
                option-text="label"
                placeholder="Start typing to search for users by email or name"
                v-model="selected">
    </vue-select>

    <b-form-text v-if="validate && errors">
      <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
    </b-form-text>
  </b-form-group>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import { VueSelect } from 'vue-select'

export default {
  extends: base,

  data () {
    return {
      users: [],
    }
  },

  computed: {
    ...mapGetters({
      currentUser: 'auth/user',
    }),

    selected: {
      get () {
        if (this.value) {
          this.findByID(this.value)
        }

        return this.users.find(v => v.value === this.value) || { value: this.value, label: this.value }
      },

      set ({ value } = {}) {
        if (value) {
          this.value = value
        }
      },
    },
  },

  beforeMount () {
    if (!this.value && this.field.options.presetWithAuthenticated) {
      // This (ID) was not converted yet
      let { ID, userID } = this.currentUser
      this.value = userID || ID
    }
  },

  methods: {
    convert ({ userID, email, name, username }) {
      return {
        value: userID,
        label: name || username || email || userID,
      }
    },

    search (query) {
      if (query) {
        this.$system.userList({ query }).then(uu => {
          this.users = uu.map(this.convert)
        })
      }
    },

    findByID (userID) {
      if (!this.users.find(v => v.value === userID)) {
        this.$system.userRead({ userID }).then(u => {
          this.users.push(this.convert(u))
        })
      }
    },
  },

  components: {
    VueSelect,
  },
}
</script>
