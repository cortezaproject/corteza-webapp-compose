<template>
  <main class="w-100 flex-grow">
    <small
      class="p-1 text-secondary position-absolute version"
    >
      {{ frontendVersion }}
    </small>
    <div v-if="loaded" class="vh-100 overflow-auto flex-grow-1">
      <b-container class="pt-2 pb-5">
        <b-row>
          <b-col>
            <div
             class="float-right pt-2"
            >
              <c-permissions-button v-if="canGrant" resource="compose:namespace:*" link />
            </div>
            <h1
              class="text-center"
            >
              {{ $t('namespace.title') }}
            </h1>
          </b-col>
        </b-row>

        <b-row>
          <div class="col-md-6 col-lg-4 col-12 mt-4" v-for="(n) in namespaces" :key="n.namespaceID">
            <div v-if="n.enabled">
              <router-link :to="{ name: 'pages', params: { slug: (n.slug || n.namespaceID) } }">
                <namespace-item :namespace="n" />
              </router-link>
            </div>
            <namespace-item v-else :namespace="n" />
          </div>
          <div v-if="canCreateNamespace" class="add-wrap col-md-6 col-lg-4 col-12 mt-4">
            <router-link :to="{ name: 'namespace.create' }">
              <div class="add-namespace">
                <span class="add-icon">+</span>
                <label class="add-text text-center d-block">
                    {{ $t('namespace.create') }}
                </label>
              </div>
            </router-link>
          </div>
        </b-row>
      </b-container>
      <c-permissions-modal />
    </div>
  </main>
</template>
<script>
import NamespaceItem from 'corteza-webapp-compose/src/components/Namespaces/NamespaceItem'
import { components } from '@cortezaproject/corteza-vue'
const { CPermissionsModal } = components

export default {
  components: {
    NamespaceItem,
    CPermissionsModal,
  },

  data () {
    return {
      loaded: false,
      error: '',
      alerts: [], // { variant: 'info', message: 'foo' },
      /* eslint-disable*/
      namespaces: [],
      canCreateNamespace: false,
      canGrant: false,
    }
  },

  computed: {
    frontendVersion () {
      /* eslint-disable no-undef */
      return VERSION
    },
  },

  created () {
    this.$auth.check().then((user) => {
      if (!user) {
        // check performed: no error & no user,
        // redirect to auth
        throw new Error()
      }
      this.error = ''

      const errHandler = (error) => {
        switch ((error.response || {}).status) {
          case 403:
            this.error = this.$t('notification.general.composeAccessNotAllowed')
        }

        return Promise.reject(error)
      }

      this.$ComposeAPI.namespaceList().then(({ set }) => {
        this.namespaces = set
        this.$ComposeAPI.permissionsEffective().then((p) => {
          this.canCreateNamespace = p.filter(per => per.operation === 'namespace.create')[0].allow
          this.canGrant = p.filter(per => per.operation === 'grant')[0].allow
          this.loaded = true
        })
      }).catch(errHandler)
    }).catch((e) => {
      this.$auth.open()
    })
  },
}
</script>
<style lang="scss" scoped>
.add-wrap {
  display: block;
  text-align: center;

  .add-icon {
    font-size: 80px;
    height: 110px;
    line-height: 100px;
    display: block;
    text-align: center;
    cursor: pointer;

    i {
      font-size: 85px;
      font-style: normal;
    }
  }

  .add-text {
    color: $secondary;
    font-size: 20px;
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

  a {
    &:hover {
      text-decoration: none;
    }
  }
}

.version {
  bottom: 0;
  right: 15px;
}
</style>
