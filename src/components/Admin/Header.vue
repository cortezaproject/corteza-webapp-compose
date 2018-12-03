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
            <form class="form-inline my-2 my-lg-0">
              <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn" type="submit">Search</button>
            </form>
          </ul>

        </b-collapse>
    </b-navbar>
  </header>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
/* stylelint-disable no-descending-specificity */

ul,li {
  padding: 0;
  margin: 0;
}

.nav-link {
  color: $black;

  &.router-link-active {
    border-bottom: 2px solid $appblue;
    color: $appblue;
  }
}

nav {
  box-shadow: 0 0.1rem 0.2rem 0 rgba(30, 34, 36, 0.1);
}

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

.navbar {
  padding: 0;
}

.navbar-toggler {
  margin: 5px 5px 5px 10px;
  font-size: 12px;
  padding: 5px 10px;

  &:focus,
  &:hover {
    outline: none;
  }
}

@media (max-width: $wideminwidth) {
  .navbar {
    padding: 10px 0;
  }

  .navbar-text {
    display: block;
  }

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
