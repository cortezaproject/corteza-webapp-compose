<template>
  <main class="container">

    <h1 class="text-center mt-4">{{ $t('namespace.title') }}</h1>

    <div class="m-2 row">
      <div class="col-md-6 col-lg-4 col-12 mt-4" v-for="(n) in namespaces" :key="n.namespaceID">
        <div v-if="n.enabled">
          <router-link :to="{ name: 'pages', params: { slug: (n.slug || n.namespaceID) } }">
            <namespace-item :namespace="n" />
          </router-link>
        </div>
        <namespace-item v-else :namespace="n" />
      </div>
      <div class="add-wrap col-md-6 col-lg-4 col-12 mt-4">
        <router-link :to="{ name: 'namespace.edit' }">
          <div class="add-namespace">
            <label class="add-icon">
              <i class="icon-plus" />
            </label>
            <label class="add-text">
                {{ $t('namespace.create') }}
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
      namespaces: [],
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

      this.$compose.namespaceList().then(({ set }) => {
        this.namespaces = set
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
