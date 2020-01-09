<template>
  <vue-select
    :filterable="false"
    :options="scripts"
    option-value="name"
    :get-option-label="({ name, label }) => label ? `${label} (${name})` : name"
    :close-on-select="true"
    v-model="selected"
  />
</template>
<script>
import { mapActions } from 'vuex'
import { VueSelect } from 'vue-select'

export default {
  name: 'c-automation-script-picker',

  components: {
    VueSelect,
  },

  props: {
    events: {
      type: Array,
      default: () => {
        return []
      },
    },

    resources: {
      type: Array,
      default: () => {
        return []
      },
    },

    filter: {
      type: Function,
      default: () => true,
    },
  },

  data () {
    return {
      value: null,
      scripts: [],
    }
  },

  computed: {
    selected: {
      get () {
        return this.value
      },

      set (value) {
        this.value = value
        this.$emit('input', value)
      },
    },
  },

  mounted () {
    const filter = {
      events: this.events,
      resources: this.resources,
    }

    this.loadScripts({ filter, force: true }).then(ss => {
      this.scripts = ss.filter(this.filter)
    })
  },

  methods: {
    ...mapActions({
      loadScripts: 'automation/load',
    }),
  },
}
</script>
