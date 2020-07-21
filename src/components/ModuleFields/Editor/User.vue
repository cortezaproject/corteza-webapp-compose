<template>
  <b-form-group
    :label="label"
    label-class="text-secondary"
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
          :append-to-body="inlineEditor"
          :calculate-position="calculatePosition"
          class="bg-white"
          @search="search"
          @input="updateValue($event)"
          ref="singleSelect"
        >
          <li v-if="showPagination" slot="list-footer" class="d-flex mt-1 mx-1">
            <b-button class="flex-grow-1" @click="filter.page -= 1" :disabled="!hasPrevPage" size="sm">Prev</b-button>
            <b-button class="flex-grow-1 ml-1" @click="filter.page += 1" :disabled="!hasNextPage" size="sm">Next</b-button>
          </li>
        </vue-select>
        <vue-select
          v-else-if="field.options.selectType === 'multiple'"
          :placeholder="$t('field.kind.user.suggestionPlaceholder')"
          :options="options"
          :get-option-label="getOptionLabel"
          :get-option-key="getOptionKey"
          :append-to-body="inlineEditor"
          :calculate-position="calculatePosition"
          class="bg-white"
          @search="search"
          v-model="multipleSelected"
          multiple
        >
          <li v-if="showPagination" slot="list-footer" class="d-flex mt-1 mx-1">
            <b-button class="flex-grow-1" @click="filter.page -= 1" :disabled="!hasPrevPage" size="sm">Prev</b-button>
            <b-button class="flex-grow-1 ml-1" @click="filter.page += 1" :disabled="!hasNextPage" size="sm">Next</b-button>
          </li>
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
          :append-to-body="inlineEditor"
          :calculate-position="calculatePosition"
          class="bg-white"
          @search="search"
          @input="updateValue($event, ctx.index)"
        >
          <li v-if="showPagination" slot="list-footer" class="d-flex mt-1 mx-1">
            <b-button class="flex-grow-1" @click="filter.page -= 1" :disabled="!hasPrevPage" size="sm">Prev</b-button>
            <b-button class="flex-grow-1 ml-1" @click="filter.page += 1" :disabled="!hasNextPage" size="sm">Next</b-button>
          </li>
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
        :append-to-body="inlineEditor"
        :calculate-position="calculatePosition"
        class="bg-white"
        @input="updateValue($event)"
        @search="search"
      >
        <li v-if="showPagination" slot="list-footer" class="d-flex mt-1 mx-1">
          <b-button class="flex-grow-1" @click="filter.page -= 1" :disabled="!hasPrevPage" size="sm">Prev</b-button>
          <b-button class="flex-grow-1 ml-1" @click="filter.page += 1" :disabled="!hasNextPage" size="sm">Next</b-button>
        </li>
      </vue-select>
      <errors :errors="errors" />
    </template>
  </b-form-group>
</template>
<script>
import { debounce } from 'lodash'
import base from './base'
import { VueSelect } from 'vue-select'
import { mapActions, mapGetters } from 'vuex'
import { createPopper } from '@popperjs/core'

export default {
  components: {
    VueSelect,
  },

  extends: base,

  data () {
    return {
      // list of items, ready to be displayed in the vue-select
      options: [],

      filter: {
        query: null,
        page: 1,
        perPage: 50,
        count: 0,
      },
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

    showPagination () {
      const { count, perPage } = this.filter
      return count > perPage
    },

    numOfPages () {
      const { count, perPage } = this.filter
      if (count > 0) {
        return Math.ceil(count / perPage)
      }
      return 0
    },

    hasPrevPage () {
      return this.filter.page > 1
    },

    hasNextPage () {
      return this.filter.page < this.numOfPages
    },
  },

  watch: {
    'filter.page': {
      handler () {
        this.search(this.filter.query)
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
      if (query !== this.filter.query) {
        this.filter.query = query
        this.filter.page = 1
      }

      if (query) {
        this.debouncedSearch(this, query)
      }
    },

    debouncedSearch: debounce((vm, query) => {
      vm.$SystemAPI.userList(vm.filter).then(({ filter, set }) => {
        vm.filter.count = filter.count
        vm.options = set.map(m => Object.freeze(m))
      })
    }, 300),

    calculatePosition (dropdownList, component, { width }) {
      /**
       * We need to explicitly define the dropdown width since
       * it is usually inherited from the parent with CSS.
       */
      dropdownList.style.width = width

      /**
       * Here we position the dropdownList relative to the $refs.toggle Element.
       *
       * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
       * the dropdownList overlap by 1 pixel.
       *
       * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
       * wrapper so that we can set some styles for when the dropdown is placed
       * above.
       */
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -1],
            },
          },
          {
            name: 'toggleClass',
            enabled: true,
            phase: 'write',
            fn ({ state }) {
              component.$el.classList.toggle('drop-up', state.placement === 'top')
            },
          }],
      })

      /**
       * To prevent memory leaks Popper needs to be destroyed.
       * If you return function, it will be called just before dropdown is removed from DOM.
       */
      return () => popper.destroy()
    },
  },
}
</script>
