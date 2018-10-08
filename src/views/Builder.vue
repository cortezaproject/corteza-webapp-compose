<template>
    <div class="builder" v-if="loaded">
        <!-- template v-if="error">
      <p>An error occured: {{error}}</p>
    </template -->
        <!-- <template v-if="modules.length == 0">
            <p>No modules have been created yet.</p>
            <a class="btn btn-primary" href="/modules/edit">Create new module</a>
        </template>
        <ul v-else>
            <li v-for="module in modules" :key="module.id">
                <a :href="module.links.read">{{module.name}}</a> [<a :href="module.links.edit">edit</a>]
            </li>
        </ul> -->

        <BlockSelector></BlockSelector>

    </div>
</template>

<script>
import crm from '@/client/crm'
import BlockSelector from '@/components/builder/BlockSelector'

export default {
    components: {
        BlockSelector,
    },
    data() {
        return {
            loaded: true,
            modules: [],
            result: {},
        }
    },

    created() {
        this.moduleList()
    },

    methods: {
        moduleList() {
            this.clearError()
            var moduleList = response => {
                if ('error' in response.data) {
                    this.showError(response.data.error.message)
                    return
                }
                if (Array.isArray(response.data.response)) {
                    this.modules.splice(0)
                    response.data.response.forEach(module => {
                        module.links = {
                            read: '/modules/' + module.id,
                            edit: '/modules/' + module.id + '/edit',
                        }
                        this.modules.push(module)
                    })
                    return
                }
                this.showError('Unexpected response when fetching module list')
            }
            var moduleListFinalizer = () => {
                this.loaded = true
            }

            crm.moduleList()
                .then(moduleList)
                .catch(e => this.showError(e))
                .finally(moduleListFinalizer)
        },
    },
}
</script>
<style lang="scss" scoped>
.builder {
    display: flex;
}
</style>
