<template>
  <div id="app" class="h-100">
    <header class="container">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/crm">Home</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <a class="nav-link" href="/crm/modules">Modules</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/crm/pages">Pages</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/crm/charts">Charts</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/crm/configuration">Configuration</a>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
    </header>
    <router-view class="view"></router-view>
  </div>
</template>

<script>
import auth from '@/mixins/auth'
export default {
  mixins: [auth],
}
</script>
