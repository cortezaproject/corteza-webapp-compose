<template>
  <div class="builder" v-if="loaded">

    <BlockSelector></BlockSelector>
    <DoneButton></DoneButton>
    <BuilderGrid></BuilderGrid>

  </div>
</template>

<script>
import BlockSelector from '@/components/builder/BlockSelector'
import BuilderGrid from '@/components/builder/BuilderGrid'
import DoneButton from '@/components/builder/DoneButton'

export default {
  components: {
    BlockSelector,
    DoneButton,
    BuilderGrid,
  },
  data () {
    return {
      loaded: true,
      modules: [],
      result: {},
    }
  },

  created () {
    this.fetchModuleList()
  },

  methods: {

    async fetchModuleList () {
      // const modules = await this.$crm.moduleContentList()
      // console.log(modules)
    },

    // moduleList () {
    //   this.clearError()
    //   var moduleList = response => {
    //     if ('error' in response.data) {
    //       this.showError(response.data.error.message)
    //       return
    //     }
    //     if (Array.isArray(response)) {
    //       this.modules.splice(0)
    //       response.forEach(module => {
    //         module.links = {
    //           read: '/modules/' + module.id,
    //           edit: '/modules/' + module.id + '/edit',
    //         }
    //         this.modules.push(module)
    //       })
    //       return
    //     }
    //     this.showError('Unexpected response when fetching module list')
    //   }
    //   var moduleListFinalizer = () => {
    //     this.loaded = true
    //   }

    //   this.$crm
    //     .moduleList()
    //     .then(moduleList)
    //     .catch(e => this.showError(e))
    //     .finally(moduleListFinalizer)
    // },
  },
}
</script>
<style lang="scss" scoped>
.builder {
  display: flex;
}
</style>
