<template>
  <div class="mt-3 w-100 pb-5 vh-100 overflow-auto flex-grow-1">
    <b-container class="pb-5">
      <b-row>
        <b-col md="12">
          <b-card class="mb-2">
            <b-row align-v="center">
              <b-col md="5">
                <b-form v-if="namespace.canCreateAutomationScript" @submit.prevent="create">
                  <b-form-group :label="$t('automation.newLabel')">
                    <b-input-group>
                      <input required
                             type="text"
                             v-model="newScript.name"
                             class="form-control"
                             id="name"
                             :placeholder="$t('automation.newPlaceholder')" />
                      <b-input-group-append>
                        <b-button type="submit" variant="dark">{{ $t('general.label.create') }}</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-form>
              </b-col>
              <b-col md="5">
                <import v-if="namespace.canCreateScript"
                        :namespace="namespace" type="script" />
              </b-col>
              <b-col md="2" class="text-right">
<!--                <export :list="sortedScripts" type="script" />-->
                <permissions-button v-if="namespace.canGrant"
                                    resource="compose:automation-script:*"
                                    link />
              </b-col>
            </b-row>
          </b-card>
          <b-card :title="$t('automation.title')">
            <table class="table table-striped">
              <thead>
              <tr>
                <table-sortable-column
                  :label="$t('general.label.name')"
                  name="name"
                  :ascending="sortedByName"
                  @sort="handleSort"/>

                <table-sortable-column
                  :label="$t('automation.list.column.label.async')"
                  name="async"
                  :ascending="sortedByAsync"
                  class="text-center"
                  @sort="handleSort"/>

                <table-sortable-column
                  :label="$t('automation.list.column.label.runInUA')"
                  name="runInUA"
                  :ascending="sortedByRunInUA"
                  class="text-center"
                  @sort="handleSort"/>

                <table-sortable-column
                  :label="$t('automation.list.column.label.critical')"
                  name="critical"
                  :ascending="sortedByCritical"
                  class="text-center"
                  @sort="handleSort"/>

                <table-sortable-column
                  :label="$t('automation.list.column.label.enabled')"
                  name="enabled"
                  :ascending="sortedByEnabled"
                  class="text-center"
                  @sort="handleSort"/>

                <table-sortable-column
                  :label="$t('general.label.updatedAt')"
                  name="updatedAt"
                  :ascending="sortedByUpdatedAt"
                  @sort="handleSort"/>

                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(s, index) in sortedScripts" :key="index">
                <td>{{ s.name || $t('automation.list.unnamed') }}</td>
                <td class="text-center"><font-awesome-icon :icon="['fas', 'check']" v-if="s.async"></font-awesome-icon></td>
                <td class="text-center"><font-awesome-icon :icon="['fas', 'check']" v-if="s.runInUA"></font-awesome-icon></td>
                <td class="text-center"><font-awesome-icon :icon="['fas', 'check']" v-if="s.critical"></font-awesome-icon></td>
                <td class="text-center"><font-awesome-icon :icon="['fas', 'check']" v-if="s.enabled"></font-awesome-icon></td>
                <td><time :datetime="s.updatedAt || s.createdAt" v-if="s.updatedAt || s.createdAt">{{ prettyDate(s.updatedAt || s.createdAt) }}</time></td>
                <td class="text-right">
                  <span v-if="s.canUpdate || s.canDelete">
                    <router-link :to="{name: 'admin.automation.edit', params: { scriptID: s.scriptID }}" class="text-dark pr-2">
                      <font-awesome-icon :icon="['far', 'edit']"></font-awesome-icon>
                    </router-link>
                  </span>
                  <permissions-button v-if="s.canGrant"
                                      :title="s.name"
                                      :resource="'compose:automation-script:'+s.scriptID"
                                      button-variant="success"
                                      link />
                </td>
              </tr>
              </tbody>
            </table>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import TableSortableColumn from 'corteza-webapp-compose/src/components/Admin/TableSortableColumn'
import AutomationScript from 'corteza-webapp-common/src/lib/types/shared/automation-script'
import tableSort from 'corteza-webapp-compose/src/mixins/table_sort'
import Import from 'corteza-webapp-compose/src/components/Admin/Import'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'

export default {
  components: {
    TableSortableColumn,
    Import,
    Export,
  },

  mixins: [
    tableSort,
  ],

  props: {
    namespace: {
      type: Object,
      required: false,
    },
  },

  data () {
    return {
      newScript: new AutomationScript(),
    }
  },

  computed: {
    ...mapGetters({
      scripts: 'automationScript/set',
    }),

    sortedByName () {
      return this.isSortedBy('name', true)
    },

    sortedByAsync () {
      return this.isSortedBy('async')
    },

    sortedByRunInUA () {
      return this.isSortedBy('runInUA')
    },

    sortedByCritical () {
      return this.isSortedBy('critical')
    },

    sortedByEnabled () {
      return this.isSortedBy('enabled')
    },

    sortedByUpdatedAt () {
      return this.isSortedBy('updatedAt')
    },

    sortedScripts () {
      return this.sortedItems([...this.scripts])
    },
  },

  created () {
    const { namespaceID } = this.namespace
    this.loadScripts({ namespaceID, perPage: 0, force: true, clear: true })
  },

  methods: {
    ...mapActions({
      loadScripts: 'automationScript/load',
      createScript: 'automationScript/create',
    }),

    create () {
      const { namespaceID } = this.namespace
      this.createScript({ namespaceID, ...this.newScript }).then(t => {
        this.$router.push({ name: 'admin.automation.edit', params: { scriptID: t.scriptID } })
      })
    },
  },
}
</script>
