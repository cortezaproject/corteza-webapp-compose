<template>
  <b-row
    cols="12"
    class="mb-1"
  >
    <b-col
      cols="3"
    >
      <b-form-checkbox
        v-model="use"
      >
        {{ $t(`field:system.${field}`) }}
      </b-form-checkbox>
    </b-col>
    <b-col
      cols="3"
    >
      <b-select
        v-model="strategy"
        :options="strategies"
        :disabled="!use"
        size="sm"
      />
    </b-col>
    <b-col
      v-if="strategy === ''"
      cols="6"
    >
      <b-form-input
        :value="storeIdent"
        :placeholder="$t('ident.placeholder')"
        size="sm"
        readonly
      />
    </b-col>
    <b-col
      v-else-if="strategy === 'json' || strategy === 'alias'"
      cols="6"
    >
      <b-form-input
        v-model="draft.ident"
        :placeholder="$t('ident.placeholder')"
        size="sm"
      />
    </b-col>
  </b-row>
</template>
<script>

const ESDefault = ''
const ESOmit = 'omit'
const ESAlias = 'alias'
const ESJSON = 'json'

function strategyConfig (strategy, config) {
  switch (strategy) {
    case ESJSON:
      return { [strategy]: { ident: config.ident } }
    case ESAlias:
      return { [strategy]: { ident: config.ident } }
    case ESOmit:
      return { [strategy]: true }

    default:
      return null
  }
}

export default {
  i18nOptions: {
    namespaces: 'module',
    keyPrefix: 'edit.config.dal.system-fields.editor',
  },

  props: {
    config: {
      type: Object,
      required: true,
    },

    field: {
      type: String,
      required: true,
    },

    storeIdent: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      // holds working copy of strategy config
      draft: {
        ident: this.storeIdent,
      },

      // strategy before omit
      undoOmit: ESDefault,

      // list of available strategies
      strategies: [
        { value: ESDefault, text: this.$t('strategies.default.label') },
        { value: ESJSON, text: this.$t('strategies.json.label') },
        { value: ESAlias, text: this.$t('strategies.alias.label') },
      ],
    }
  },

  computed: {
    // current strategy
    strategy: {
      get () {
        return Object.keys(this.config)[0] || ESDefault
      },

      set (strategy) {
        this.$emit('change', strategyConfig(strategy, this.draft))
      },
    },

    // use => when field is not used it is omitted
    use: {
      get () {
        return this.strategy !== ESOmit
      },

      set (use) {
        if (this.strategy !== ESOmit) {
          this.undoOmit = this.strategy
        }

        this.strategy = use ? this.undoOmit : ESOmit
      },
    },
  },

  watch: {
    draft: {
      deep: true,
      handler () {
        this.$emit('change', strategyConfig(this.strategy, this.draft))
      },
    },
  },
}
</script>
