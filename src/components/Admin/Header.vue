<template>
  <header>
    <b-navbar toggleable type="light" toggle-breakpoint="md">
        <b-navbar-toggle target="nav_text_collapse"></b-navbar-toggle>
        <b-collapse is-nav id="nav_text_collapse">
          <ul>
            <li>
              <router-link :to="{name: 'admin.modules'}" class="nav-link">Modules</router-link>
            </li>
            <li>
              <router-link :to="{name: 'admin.pages'}" class="nav-link">Pages</router-link>
            </li>
            <li>
              <router-link :to="{name: 'admin.charts'}" class="nav-link">Charts</router-link>
            </li>
            <li>
              <router-link :to="{name: 'admin.configuration'}" class="nav-link">Configuration</router-link>
            </li>
          </ul>

        </b-collapse>
    </b-navbar>
  </header>
</template>

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
      padding: 19px 20px;
      display: block;
    }
  }
}

.form-inline {
  display: inline;
  margin-left: 50px;
}

@media (max-width: $wideminwidth) {
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
