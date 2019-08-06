<template>
  <b-form-group :label="field.label || field.name">
    <multi v-if="field.isMulti" :value.sync="value" :singleInput="field.options.selectType !== 'each'" :removable="field.options.selectType !== 'multiple'">
      <template v-slot:single>
        <vue-select v-if="field.options.selectType === 'default'"
                    :options="users"
                    @search="search"
                    option-value="userID"
                    option-text="label"
                    :placeholder="$t('field.kind.user.suggestionPlaceholder')"
                    @input="selectChange($event)"
                    ref="singleSelect">
        </vue-select>
        <vue-select v-else-if="field.options.selectType === 'multiple'"
                    :options="users"
                    @search="search"
                    option-value="userID"
                    option-text="label"
                    :placeholder="$t('field.kind.user.suggestionPlaceholder')"
                    multiple
                    v-model="multipleSelected">
        </vue-select>
      </template>
      <template v-slot:default="ctx">
        <vue-select v-if="field.options.selectType === 'each'"
                    :options="users"
                    @search="search"
                    option-value="userID"
                    option-text="label"
                    :placeholder="$t('field.kind.user.suggestionPlaceholder')"
                    :value="getUser(ctx.index)"
                    @input="setUser($event, ctx.index)">
        </vue-select>
        <span v-else>{{ getUser(ctx.index).label }}</span>
      </template>
    </multi>

    <vue-select v-else
                :options="users"
                @search="search"
                option-value="userID"
                option-text="label"
                :placeholder="$t('field.kind.user.suggestionPlaceholder')"
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

    // This is used in the case of using the multiple select option
    multipleSelected: {
      get () {
        return this.value.map(value => this.users.find(v => v.value === value) || { value: value, label: value })
      },

      set (value) {
        this.value = value.map(v => v.value)
      },
    },

    selected: {
      get () {
        return this.getUser()
      },

      set (value) {
        this.setUser(value)
      },
    },
  },

  beforeMount () {
    if ((!this.value || this.value.length === 0) && this.field.options.presetWithAuthenticated) {
      // This (ID) was not converted yet
      let { ID, userID } = this.$auth.user
      if (this.field.isMulti) {
        this.value.push(userID || ID)
      } else {
        this.value = userID || ID
      }
    }
  },

  methods: {
    getUser (index = undefined) {
      const value = index !== undefined ? this.value[index] : this.value
      if (value) {
        this.findUserByID(value)
      }

      return this.users.find(v => v.value === value) || { value: value, label: value }
    },

    setUser (event, index = undefined) {
      if (event) {
        const { value } = event
        if (index !== undefined) {
          this.value[index] = value
        } else {
          this.value = value
        }
      }
    },

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

    selectChange (event) {
      this.value.push(event.value)
      // Cant mutate props so we use magic(refs)
      this.$refs.singleSelect.mutableValue = null
    },
  },
}
</script>
