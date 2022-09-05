<template>
  <b-tab
    title="Progress"
    class="vh-100"
  >
    <template>
      <h5 class="text-primary">
        Value
      </h5>

      <b-row>
        <b-col
          cols="12"
        >
          <b-form-group
            label="Module"
          >
            <vue-select
              v-model="options.value.moduleID"
              label="name"
              placeholder="Select module"
              :options="modules"
              :reduce="m => m.moduleID"
              class="bg-white"
            />
          </b-form-group>
        </b-col>

        <template v-if="options.value.moduleID">
          <b-col
            cols="12"
          >
            <b-form-group :label="$t('metric.edit.filterLabel')">
              <b-form-textarea
                v-model="options.value.filter"
                placeholder="(A > B) OR (A < C)"
                class="mb-1"
              />
              <b-form-text>
                <i18next
                  path="metric.edit.filterFootnote"
                  tag="label"
                >
                  <code>${recordID}</code>
                  <code>${ownerID}</code>
                  <code>${userID}</code>
                </i18next>
              </b-form-text>
            </b-form-group>
          </b-col>

          <b-col
            cols="12"
            sm="6"
          >
            <b-form-group
              label="Field"
            >
              <vue-select
                v-model="options.value.field"
                label="name"
                placeholder="Select field"
                :options="valueModuleFields"
                :reduce="f => f.fieldID"
                class="bg-white"
              />
            </b-form-group>
          </b-col>

          <b-col
            cols="12"
            sm="6"
          >
            <b-form-group
              label="Aggregation operation"
            >
              <vue-select
                v-model="options.value.aggregation"
                label="name"
                :disabled="!options.value.field || options.value.field === 'count'"
                placeholder="Select aggregation operation"
                :options="aggregationOperations"
                :reduce="a => a.operation"
                class="bg-white"
              />
            </b-form-group>
          </b-col>
        </template>
      </b-row>
    </template>

    <hr>

    <template>
      <h5 class="text-primary">
        Maximum value
      </h5>

      <b-row>
        <b-col
          cols="12"
        >
          <b-form-group
            label="Module"
          >
            <vue-select
              v-model="options.maxValue.moduleID"
              label="name"
              placeholder="Select module"
              :options="modules"
              :reduce="m => m.moduleID"
              class="bg-white"
            />
          </b-form-group>
        </b-col>

        <template v-if="options.maxValue.moduleID">
          <b-col
            cols="12"
          >
            <b-form-group :label="$t('metric.edit.filterLabel')">
              <b-form-textarea
                v-model="options.maxValue.filter"
                placeholder="(A > B) OR (A < C)"
                class="mb-1"
              />
              <b-form-text>
                <i18next
                  path="metric.edit.filterFootnote"
                  tag="label"
                >
                  <code>${recordID}</code>
                  <code>${ownerID}</code>
                  <code>${userID}</code>
                </i18next>
              </b-form-text>
            </b-form-group>
          </b-col>

          <b-col
            cols="12"
            sm="6"
          >
            <b-form-group
              label="Field"
            >
              <vue-select
                v-model="options.maxValue.field"
                label="name"
                placeholder="Select field"
                :options="maxValueModuleFields"
                :reduce="f => f.fieldID"
                class="bg-white"
              />
            </b-form-group>
          </b-col>

          <b-col
            cols="12"
            sm="6"
          >
            <b-form-group
              label="Aggregation operation"
            >
              <vue-select
                v-model="options.maxValue.aggregation"
                label="name"
                :disabled="!options.maxValue.field || options.maxValue.field === 'count'"
                placeholder="Select aggregation operation"
                :options="aggregationOperations"
                :reduce="a => a.operation"
                class="bg-white"
              />
            </b-form-group>
          </b-col>
        </template>
      </b-row>
    </template>

    <hr>

    <template>
      <h5 class="text-primary">
        Display options
      </h5>

      <b-row
        align-v="center"
      >
        <b-col
          cols="12"
          sm="6"
        >
          <b-form-group
            :label="'Default variant'"
          >
            <b-form-select
              v-model="options.display.variant"
              :options="variants"
            />
          </b-form-group>
        </b-col>

        <b-col
          cols="6"
          sm="3"
          class="mb-2 mb-sm-0"
        >
          <b-form-group
            class="mb-0"
          >
            <b-form-checkbox
              v-model="options.display.showValue"
              class="mb-2"
            >
              Show value
            </b-form-checkbox>
            <b-form-checkbox
              v-model="options.display.animated"
            >
              Animated
            </b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col
          cols="6"
          sm="3"
          class="mb-2 mb-sm-0"
        >
          <b-form-group
            v-if="options.display.showValue"
            class="mb-0"
          >
            <b-form-checkbox
              v-model="options.display.showRelative"
              class="mb-2"
            >
              Show relative
            </b-form-checkbox>
            <b-form-checkbox
              v-model="options.display.showProgress"
            >
              Show progress
            </b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col
          cols="12"
        >
          <b-form-group>
            <template #label>
              <div
                class="d-flex align-items-center"
              >
                Thresholds
                <b-button
                  variant="link"
                  class="text-decoration-none ml-1"
                  @click="addThreshold()"
                >
                  + Add
                </b-button>
              </div>

              <small
                class="text-muted"
              >
                Set which variant to show if value exceeds the threshold
              </small>
            </template>
            <b-row
              v-for="(t, i) in options.display.thresholds"
              :key="i"
              align-v="center"
              :class="{ 'mt-2': i }"
            >
              <b-col>
                <b-form-input
                  v-model="t.value"
                  :placeholder="'Threshold'"
                  type="number"
                  number
                />
              </b-col>
              <b-col
                class="d-flex align-items-center justify-content-center"
              >
                <b-form-select
                  v-model="t.variant"
                  :options="variants"
                />

                <font-awesome-icon
                  :icon="['fas', 'times']"
                  class="pointer text-danger ml-3"
                  @click="removeThreshold(i)"
                />
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Don't remove, makes sure preview doesn't cover content -->
      <div class="w-501 my-5 py-5 py-sm-3" />

      <template>
        <div
          class="preview bg-white position-absolute p-3"
        >
          <h6 class="text-primary">
            Preview
          </h6>

          <b-progress
            :max="preview.max"
            height="1.5rem"
            class="mb-2 bg-light"
          >
            <b-progress-bar
              :value="preview.value"
              :striped="options.display.striped"
              :animated="options.display.animated"
              :variant="progressVariant"
            >
              {{ progressLabel }}
            </b-progress-bar>
          </b-progress>

          <b-row>
            <b-col
              cols="12"
              sm="6"
            >
              Value
              <b-form-input
                v-model="preview.value"
                placeholder="Value"
                type="number"
                size="sm"
              />
            </b-col>

            <b-col
              cols="12"
              sm="6"
            >
              Maximum value
              <b-form-input
                v-model="preview.max"
                placeholder="Maximum value"
                type="number"
                size="sm"
              />
            </b-col>
          </b-row>
        </div>
      </template>
    </template>
  </b-tab>
</template>

<script>
import base from './base'
import { mapGetters } from 'vuex'
import { VueSelect } from 'vue-select'

export default {
  i18nOptions: {
    namespaces: 'block',
  },

  name: 'ProgressConfigurator',

  components: {
    VueSelect,
  },

  extends: base,

  data () {
    return {
      preview: {
        value: 15,
        max: 50,
      },

      aggregationOperations: [
        {
          name: this.$t('metric.edit.operationSum'),
          operation: 'sum',
        },
        {
          name: this.$t('metric.edit.operationMax'),
          operation: 'max',
        },
        {
          name: this.$t('metric.edit.operationMin'),
          operation: 'min',
        },
        {
          name: this.$t('metric.edit.operationAvg'),
          operation: 'avg',
        },
      ],

      variants: [
        { text: 'Primary', value: 'primary' },
        { text: 'Secondary', value: 'secondary' },
        { text: 'Success', value: 'success' },
        { text: 'Warning', value: 'warning' },
        { text: 'Danger', value: 'danger' },
        { text: 'Info', value: 'info' },
        { text: 'Light', value: 'light' },
        { text: 'Dark', value: 'dark' },
      ],
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
      moduleByID: 'module/getByID',
    }),

    sharedModuleFields () {
      return [
        { fieldID: 'count', name: 'Count' },
      ]
    },

    valueModuleFields () {
      return [
        ...this.sharedModuleFields,
        ...this.moduleByID(this.options.value.moduleID).fields.filter(f => f.kind === 'Number').sort((a, b) => a.name.localeCompare(b.name)),
      ]
    },

    maxValueModuleFields () {
      return [
        ...this.sharedModuleFields,
        ...this.moduleByID(this.options.maxValue.moduleID).fields.filter(f => f.kind === 'Number').sort((a, b) => a.name.localeCompare(b.name)),
      ]
    },

    progressLabel () {
      let { value, max } = this.preview
      const { showValue, showRelative, showProgress } = this.options.display || {}

      if (!showValue) {
        return
      }

      if (showRelative) {
        // https://stackoverflow.com/a/21907972/17926309
        value = `${Math.round(((value / max) * 100) * 100) / 100}%`
      }

      if (showProgress) {
        value = `${value} / ${showRelative ? '100' : max}${showRelative ? '%' : ''}`
      }

      return value
    },

    progressVariant () {
      const { value } = this.preview
      const { variant } = this.options.display || {}
      let progressVariant = variant

      if (this.options.display.thresholds.length) {
        const sortedVariants = [...this.options.display.thresholds].filter(t => t.value).sort((a, b) => b.value - a.value)
        const { variant } = sortedVariants.find(t => value > t.value) || {}
        progressVariant = variant || progressVariant
      }

      return progressVariant
    },
  },

  methods: {
    addThreshold () {
      this.options.display.thresholds.push({ value: 0, variant: 'success' })
    },

    removeThreshold (index) {
      if (index > -1) {
        this.options.display.thresholds.splice(index, 1)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.preview {
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  box-shadow: 0 -0.25rem 1rem rgb(0 0 0 / 15%);
}
</style>
