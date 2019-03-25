<template>
  <header>
    <b-navbar toggleable="md" type="light">
        <b-navbar-toggle target="admin_nav_collapse">
          <label
            class="channel-toggle">
            <i class="icon-menu4"></i>
          </label>
        </b-navbar-toggle>
        <b-collapse is-nav id="admin_nav_collapse" :class="{ visible }" @show="toggleNav(true)" @hide="toggleNav(false)">
          <ul>
            <li>
              <router-link :to="{name: 'admin.modules'}" class="nav-link">{{ $t('navigation.module') }}</router-link>
            </li>
            <li>
              <router-link :to="{name: 'admin.pages'}" class="nav-link">{{ $t('navigation.page') }}</router-link>
            </li>
            <li>
              <router-link :to="{name: 'admin.charts'}" class="nav-link">{{ $t('navigation.chart') }}</router-link>
            </li>
            <li>
              <router-link :to="{name: 'admin.automation'}" class="nav-link">{{ $t('navigation.automation') }}</router-link>
            </li>
            <li v-if="false">
              <router-link :to="{name: 'admin.configuration'}" class="nav-link">{{ $t('navigation.configuration') }}</router-link>
            </li>
          </ul>
        </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
import navbarCollapse from '@/mixins/navbar_collapse'

export default {
  mixins: [ navbarCollapse ],
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/header.scss";
/* stylelint-disable no-descending-specificity */

ul {
  font-size: 15px;
  margin: 0 auto;

  li {
    display: inline-block;
    cursor: pointer;

    a {
      padding: 13px 15px;
      display: block;
    }
  }
}

.form-inline {
  display: inline;
  margin-left: 50px;
}

.navbar-collapse {
  max-width: 100%;
}

@media (max-width: 768px) {
  ul {
    position: relative;

    li {
      display: block;

      a {
        padding: 10px 20px;
      }
    }

    .form-inline {
      display: block;
      margin-left: 20px;
    }
  }
}

</style>
