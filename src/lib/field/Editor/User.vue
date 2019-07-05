<template>
  <b-form-group :label="field.label || field.name">
    <vue-select :options="users"
                @search="search"
                option-value="userID"
                option-text="label"
                :placeholder="$t('field.kind.user.suggestionPlacehodler')"
                v-model="selected">
    </vue-select>

    <b-form-text v-if="validate && errors">
      <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
    </b-form-text>
  </b-form-group>
</template>
<script>
import base from './base'
import { VueSelect } from 'vue-select'
import { mapGetters } from 'vuex'

export default {
  components: {
    VueSelect,
  },

  extends: base,

  data () {
    return {
      users: [],
    }
  },

  computed: {
    ...mapGetters({
      findByID: 'user/findByID',
      allUsers: 'user/set',
    }),

    selected: {
      get () {
        if (this.value) {
          this.findUserByID(this.value)
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
      let { ID, userID } = this.$auth.user
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
        this.users = this.allUsers.map(this.convert)
      }
    },

    findUserByID (userID) {
      if (!this.users.find(v => v.value === userID)) {
        this.users.push(this.convert(this.findByID(userID)))
      }
    },
  },
}
</script>
