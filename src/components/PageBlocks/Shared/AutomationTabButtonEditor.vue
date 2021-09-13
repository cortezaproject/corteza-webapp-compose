<template>
  <b-card
    :header="workflow ? $t('editTitle.workflow') : $t('editTitle.script')"
    footer-class="text-right"
  >
    <b-form-group
      :label="$t('buttonLabel')"
    >
      <b-input-group>
        <b-form-input
          disabled
          v-model="button.label"
        />
        <b-input-group-append>
          <page-translator
            v-if="page"
            :page="page"
            :block="block"
            highlight-key="pageBlock.0.automation"
            button-variant="light"
          />
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <b-form-group
      :label="$t('buttonVariant')"
    >
      <b-select
        class="w-100"
        size="sm"
        v-model="button.variant"
      >
        <b-select-option
          v-for="({ variant, label }) in variants"
          :key="variant"
          :value="variant"
        >
          {{ label }}
        </b-select-option>
      </b-select>
    </b-form-group>

    <div
      v-if="workflow"
    >
      <h5>
        {{ workflow.meta.name || $t('noLabel') }}
      </h5>
      <var>
        {{ $t('stepID', trigger.stepID) }}
      </var>
    </div>
    <code
      v-else-if="button.script"
    >
      {{ button.script }}
    </code>
    <b-alert
      show
      variant="warning"
      v-else
    >
      {{ $t('noScript' )}}
    </b-alert>
    <p
      v-if="workflow && workflow.meta"
      class="mb-0 mt-2"
    >
      {{ workflow.meta.description || $t('noDescription') }}
    </p>
    <p
      v-else-if="script"
      class="mb-0 mt-2"
    >
      {{ script.description || $t('noDescription') }}
    </p>
    <template #footer>
      <c-input-confirm
        @confirmed="$emit('delete', button)"
        variant="link-light"
      />
    </template>
  </b-card>
</template>
<script>
import { compose } from '@cortezaproject/corteza-js'
import PageTranslator from 'corteza-webapp-compose/src/components/Admin/Page/PageTranslator'

export default {
  components: {
    PageTranslator,
  },

  i18nOptions: {
    keyPrefix: 'block.automation',
  },

  props: {
    button: {
      type: Object,
      required: true,
    },

    script: {
      type: Object,
      required: false,
    },

    trigger: {
      type: Object,
      required: false,
    },

    page: {
      type: compose.Page,
      required: true,
    },

    block: {
      type: compose.PageBlock,
      required: true,
    },
  },

  computed: {
    variants () {
      return [
        'primary',
        'secondary',
        'light',
        'dark',
        'success',
        'danger',
        'warning',
      ].map(variant => ({ variant, label: this.$t(`${variant}Button`) }))
    },

    workflow () {
      return this.trigger ? this.trigger.workflow : undefined
    },
  },
}
</script>
