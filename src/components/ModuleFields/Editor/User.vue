<template>
  <b-form-group
    :label="label"
    :class="formGroupStyleClasses"
  >
    <multi v-if="field.isMulti" :value.sync="value" :singleInput="field.options.selectType !== 'each'" :removable="field.options.selectType !== 'multiple'">
      <template v-slot:single>
        <vue-select
          v-if="field.options.selectType === 'default'"
          :placeholder="$t('field.kind.user.suggestionPlaceholder')"
          :options="options"
          :get-option-label="getOptionLabel"
          :get-option-key="getOptionKey"
          :clearable="false"
          @search="search"
          @input="updateValue($event)"
          ref="singleSelect"
        >
        </vue-select>
        <vue-select
          v-else-if="field.options.selectType === 'multiple'"
          :placeholder="$t('field.kind.user.suggestionPlaceholder')"
          :options="options"
          :get-option-label="getOptionLabel"
          :get-option-key="getOptionKey"
          @search="search"
          v-model="multipleSelected"
          multiple
        >
        </vue-select>
      </template>
      <template v-slot:default="ctx">
        <vue-select
          v-if="field.options.selectType === 'each'"
          :placeholder="$t('field.kind.user.suggestionPlaceholder')"
          :options="options"
          :get-option-label="getOptionLabel"
          :get-option-key="getOptionKey"
          :value="getUserByIndex(ctx.index)"
          :clearable="false"
          @search="search"
          @input="updateValue($event, ctx.index)"
        >
        </vue-select>
        <span v-else>{{ getOptionLabel(getUserByIndex(ctx.index)) }}</span>
      </template>
      <errors :errors="errors" />
    </multi>
    <template
      v-else
    >
      <vue-select
        :placeholder="$t('field.kind.user.suggestionPlaceholder')"
        :options="options"
        :get-option-label="getOptionLabel"
        :get-option-key="getOptionKey"
        :value="getUserByIndex()"
        @input="updateValue($event)"
        @search="search"
      />
      <errors :errors="errors" />
    </template>
  </b-form-group>
</template>
<script>
import { debounce } from 'lodash'
import base from './base'
import { VueSelect } from 'vue-select'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    VueSelect,
  },

  extends: base,

  data () {
    return {
      // list of items, ready to be displayed in the vue-select
      options: [],
    }
  },

  computed: {
    ...mapGetters({
      resolved: 'user/set',
      findByID: 'user/findByID',
    }),

    // This is used in the case of using the multiple select option
    multipleSelected: {
      get () {
        const map = userID => {
          return this.findByID(userID) ||
                 { userID }
        }

        return this.field.isMulti ? this.value.map(map) : map(this.value)
      },

      set (users) {
        if (users && Array.isArray(users)) {
          // When adding/removing items from vue-selects[multiple],
          // we get array of options back

          this.addUserToResolved(users)
          this.value = users.map(({ userID }) => userID)
        }
      },
    },
  },

  async beforeMount () {
    await this
      .resolveUsers(this.field.isMulti ? [...this.value] : [this.value])
      .finally(() => {
        if ((!this.value || this.value.length === 0) && this.field.options.presetWithAuthenticated) {
          this.updateValue(this.$auth.user)
        }
      })
  },

  methods: {
    ...mapActions({
      resolveUsers: 'user/fetchUsers',
      addUserToResolved: 'user/push',
    }),

    getOptionKey ({ userID }) {
      return userID
    },

    getOptionLabel ({ userID, email, name, username }) {
      return name || username || email || `<@${userID}>`
    },

    /**
     * Updates record value with user
     *
     * Handles single & multi value fields
     */
    updateValue (user, index = -1) {
      console.log(user)
      console.log(index)
      if (user) {
        // update list of resolved users for every item we add
        this.addUserToResolved({ ...user })

        // update valie on record
        const { userID } = user
        if (this.field.isMulti) {
          if (index >= 0) {
            this.value[index] = userID
          } else {
            // <0, assume we're appending
            this.value.push(userID)
          }
        } else {
          this.value = userID
        }
      } else {
        if (index >= 0) {
          this.value.splice(index, 1)
        } else {
          this.value = undefined
        }
      }
    },

    /**
     * Retrives user (via value) from record field
     * Handles single & multi value fields
     */
    getUserByIndex (index = 0) {
      const userID = this.field.isMulti ? this.value[index] : this.value
      if (userID) {
        return this.findByID(userID) || {}
      }
    },

    search (query) {
      if (query) {
        this.debouncedSearch(this, query)
      }
    },

    debouncedSearch: debounce((vm, query) => {
      vm.$SystemAPI.userList({ query }).then(({ set }) => {
        vm.options = set.map(m => Object.freeze(m))
      })
    }, 300),
  },
}
</script>
