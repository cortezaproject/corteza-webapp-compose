<template>
  <report-edit
    :report.sync="editReport"
    :modules="modules"
    :dimension-field-kind="['Select']"
    :supported-metrics="1"
    un-skippable
  >
    <template #dimension-options="{ dimension }">
      <b-form-group
        :label="$t('edit.dimension.gaugeSteps')"
        :label-cols="2"
      >
        <b-input-group
          v-for="(step, i) in dimension.meta.steps"
          :key="i"
          class="mb-1"
        >
          <b-form-input
            v-model="step.label"
            plain
            size="sm"
            :placeholder="$t('general.label.title')"
          />

          <b-form-input
            v-model="step.value"
            type="number"
            size="sm"
            :placeholder="$t('general.value')"
          />

          <b-input-group-append>
            <b-button
              variant="link"
              class="border-0 text-danger"
              @click.prevent="dimension.meta.steps.splice(i, 1)"
            >
              <font-awesome-icon :icon="['far', 'trash-alt']" />
            </b-button>
          </b-input-group-append>
        </b-input-group>

        <b-btn
          variant="link"
          class="p-0"
          @click="dimension.meta.steps.push({ label: undefined, color: undefined, value: undefined })"
        >
          + {{ $t('general.label.add') }}
        </b-btn>
      </b-form-group>
    </template>

    <template #metric-options="{ metric }">
      <b-form-group
        :label="$t('edit.metric.fx.label')"
        :description="$t('edit.metric.fx.description')"
      >
        <b-form-textarea
          v-model="metric.fx"
          placeholder="n"
        />
      </b-form-group>

      <b-form-group
        horizontal
        :label="$t('edit.metric.gaugeColor')"
        :label-cols="2"
      >
        <b-form-input
          v-model="metric.backgroundColor"
          type="color"
          class="p-0 border-0 color-picker"
        />
      </b-form-group>

      <b-form-checkbox
        v-model="metric.fixTooltips"
        :value="true"
        :unchecked-value="false"
      >
        {{ $t('edit.metric.fixTooltips') }}
      </b-form-checkbox>
    </template>
  </report-edit>
</template>

<script>
import ReportEdit from './ReportEdit'
import base from './base'

export default {
  i18nOptions: {
    namespaces: 'chart',
  },

  components: {
    ReportEdit,
  },

  extends: base,

  methods: {
    renderPicker (field) {
      return field && field.kind === 'Select' && field.options.options
    },

    makeOptions (field, dimension) {
      const ff = dimension.meta.fields || []
      return field.options.options.map(({ text, value }) => ({
        text,
        value,
        color: (ff.find(b => value === b.value) || {}).color,
      }))
    },
  },
}
</script>

<style scoped lang="scss">
  .color-picker {
    width: 30px;
  }
</style>
