<template>
  <b-modal
    v-model="showModal"
    :title="$t('privacy.title')"
    :ok-title="$t('general.label.saveAndClose')"
    ok-only
    ok-variant="primary"
    size="lg"
    @ok="onSave()"
  >
    <b-form-group
      :label="$t('privacy.data-source')"
      label-class="text-primary"
      :class="{ 'mb-0': !datasource }"
    >
      <vue-select
        v-model="datasource"
        :options="datasources"
        option-text="label"
        option-value="datasourceID"
        :placeholder="$t('privacy.select-data-source')"
        class="h-100 bg-white"
      />
    </b-form-group>

    <div
      v-if="datasource"
    >
      <b-row>
        <b-col
          cols="12"
          sm="6"
        >
          <b-form-group
            :label="$t('privacy.location')"
            label-class="text-primary"
          >
            <span
              class="ml-2"
            >
              {{ datasource.location }}
            </span>
          </b-form-group>
        </b-col>
        <b-col
          cols="12"
          sm="6"
        >
          <b-form-group
            :label="$t('privacy.ownership')"
            label-class="text-primary"
          >
            <span
              class="ml-2"
            >
              {{ datasource.ownership }}
            </span>
          </b-form-group>
        </b-col>
      </b-row>

      <hr>

      <b-row
        class="mt-4 pt-2"
      >
        <b-col
          v-for="cap in capabilities"
          :key="cap.name"
          cols="12"
          sm="6"
          lg="4"
        >
          <b-form-group>
            <template #label>
              <div
                class="d-flex align-items-center text-capitalize text-primary h6 mb-0 mr-5"
              >
                {{ cap.name }}
                <font-awesome-icon
                  :icon="['far', 'question-circle']"
                  class="text-dark ml-2"
                />
              </div>
            </template>

            <b-form-checkbox
              v-model="cap.enabled"
              :disabled="cap.supportType !== 'supported'"
              class="text-capitalize ml-3"
            >
              {{ cap.supportType === 'supported' ? 'Enabled' : cap.supportType }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
import VueSelect from 'vue-select'

export default {
  i18nOptions: {
    namespaces: 'module',
  },

  components: {
    VueSelect,
  },

  props: {
    modal: {
      type: Boolean,
      required: false,
    },
  },

  data () {
    return {
      datasource: undefined,

      datasources: [
        {
          datasourceID: '1',
          label: 'Primary Database (Owned by ACME LTD and Located in Ireland',
          location: 'Ireland',
          ownership: 'Private',
        },
        {
          datasourceID: '2',
          label: 'Secondary Database (Owned by ASGR LTD and Located in France',
          location: 'France',
          ownership: 'Private',
        },
      ],

      capabilities: [
        { name: 'immutable', supportType: 'enforced', enabled: true },
        { name: 'encrypted', supportType: 'supported', enabled: false },
        { name: 'accessControl', supportType: 'enforced', enabled: true },
        { name: 'softDelete', supportType: 'enforced', enabled: true },
        { name: 'revisioned', supportType: 'enforced', enabled: true },
        { name: 'automation', supportType: 'unsupported', enabled: false },
        { name: 'pagination', supportType: 'enforced', enabled: true },
        { name: 'filtering', supportType: 'enforced', enabled: true },
        { name: 'search', supportType: 'enforced', enabled: true },
        { name: 'ownership', supportType: 'enforced', enabled: true },
        { name: 'timestamps', supportType: 'enforced', enabled: true },
        { name: 'auditLog', supportType: 'enforced', enabled: true },
      ],
    }
  },

  computed: {
    showModal: {
      get () {
        return this.modal
      },

      set (showModal) {
        this.$emit('update:modal', showModal)
      },
    },
  },

  methods: {
    onSave () {
    },
  },
}
</script>
