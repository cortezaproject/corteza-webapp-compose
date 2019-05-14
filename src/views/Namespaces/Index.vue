<template>
  <main class="container">

    <h1 class="text-center mt-4">Compose Namespaces</h1>

    <div class="m-2 row">
      <div class="col-md-6 col-lg-4 col-12 mt-4" v-for="(n) in namespaces" :key="n.namespaceID">
        <namespace-item :namespace="n" />
      </div>
      <div class="add-wrap col-md-6 col-lg-4 col-12 mt-4">
        <router-link :to="{ name: 'namespace.create'}">
          <div class="add-namespace">
            <label class="add-icon">
              <i class="icon-plus" />
            </label>
            <label class="add-text">
                Create namespace
            </label>
          </div>
        </router-link>
      </div>
    </div>

  </main>
</template>
<script>
import NamespaceItem from '@/components/Namespaces/NamespaceItem'

export default {
  data () {
    return {
      loaded: false,
      error: '',
      alerts: [], // { variant: 'info', message: 'foo' },
      /* eslint-disable*/
      namespaces: [{"namespaceID":"887148827239863655","name":"Crust CRM","slug":"crm","meta":{"subtitle": "this is a subtitle"},"createdAt":"2019-05-08T11:19:47Z","updatedAt":undefined,"canCreateChart":false,"canCreateModule":false,"canCreatePage":false,"canCreateTrigger":false,"canDeleteNamespace":false,"canUpdateNamespace":false},{"namespaceID":"8871148827239863655","name":"Crust CRM","slug":"crm","meta":{"description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "subtitle":"BBBBBBBBBBBBBBBB"},"createdAt":"2019-05-08T11:19:47Z","updatedAt":undefined,"canCreateChart":false,"canCreateModule":false,"canCreatePage":false,"canCreateTrigger":false,"canDeleteNamespace":false,"canUpdateNamespace":false}, {"namespaceID":"8871482827239863655","name":"Crust CRM","slug":"crm","meta":{},"createdAt":"2019-05-08T11:19:47Z","updatedAt":undefined,"canCreateChart":false,"canCreateModule":false,"canCreatePage":false,"canCreateTrigger":false,"canDeleteNamespace":false,"canUpdateNamespace":false}],  
      currentID: ''
    }
  },

  created () {
    this.$auth.check(this.$system).then(() => {
      this.error = ''

      const errHandler = (error) => {
        switch ((error.response || {}).status) {
          case 403:
            this.error = this.$t('notification.general.composeAccessNotAllowed')
        }

        return Promise.reject(error)
      }

      this.$store.dispatch('namespace/load').then((nn) => {
        //this.namespaces = nn
        this.loaded = true
      }).catch(errHandler)
    }).catch((e) => {
      window.location = '/auth'
    })
  },

  components: {
    NamespaceItem,
  }
}
</script>
<style lang="scss" scoped>
.add-wrap {
  display: block;
  text-align: center;

  .add-icon {
    height: 100px;
    line-height: 100px;
    display: block;
    text-align: center;
    cursor: pointer;

    i {
      display: block;
      line-height: 128px;
      margin: 0 auto;
      font-size: 86px;
      font-style: normal;
    }
  }

  .add-text {
    height: 100px;
    line-height: 100px;
    display: block;
    text-align: center;
    color: #90A3B1;
    font-size: 24px;
    max-width: 75%;
    margin: 0 auto;
    cursor: pointer;
  }

  .add-namespace {
    border: 3px solid #fff;
    min-height: 200px;
    max-height: 200px;

    &:hover,
    &:focus {
      background-color: #fff;

      i {
        color: #000;
      }

      .add-text {
        color: #000;
      }
    }
  }
}
</style>
