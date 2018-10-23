import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    ...publicRoutes(),
    ...protectAll(privateRoutes()),
    route('*', '404'),
  ],
})

function publicRoutes () {
  return [
    route('/crm/auth/signin', 'Auth/SignIn'),
    route('/crm/auth/signout', 'Auth/SignOut'),

  ]
}

function privateRoutes () {
  return [
    route('/crm', 'Index'),

    // --- B --- Modules CRUD
    route('/crm/modules', 'Modules/Index'),
    route('/crm/modules/:id/edit', 'Modules/Edit'),
    // --- B --- Modules CRUD

    // --- B --- Pages CRUD
    route('/crm/pages', 'Pages/Index'),
    route('/crm/pages/:id', 'Pages/View'),
    route('/crm/pages/:id/edit', 'Pages/Edit'),
    // --- E --- Pages CRUD

    // --- Builder
    route('/crm/builder', 'Builder'),

    // --- B --- Public (end user pages)
    route('/', 'Public/Redirect'),
    route('/pages', 'Public/Redirect'),
    route('/pages/:id', 'Public/Pages/View'),
    // --- E --- Public (end user pages)
  ]
}

/*
 * Converts path into route with component
 *
 * ~~~
 * path=/account/login -> component = views/Account/Login.vue
 * path=/ -> component = views/Index.vue
 * path=/, componentName=Landing -> component = views/Landing.vue
 * ~~~
 */
function route (path, componentName, children) {
  var result = { path: path }
  if (typeof componentName !== 'string') {
    componentName = path.substring(1).split('/')
    if (path.length === 1) {
      componentName = []
    }
    componentName = componentName.map(function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    })
    if (path.charAt(path.length - 1) === '/') {
      componentName.push('Index')
    }
    while (componentName[componentName.length - 1].charAt(0) === ':') {
      componentName.pop()
    }
    componentName = componentName.join('/')
  }
  result.component = view(componentName)
  result.meta = {
    componentName: componentName,
  }
  if (typeof children !== 'undefined') {
    result.children = children
  }
  return result
}

function protect (routeEntry) {
  routeEntry.beforeEnter = (to, from, next) => {
    next(store.getters['auth/isAuthenticated'] ? true : '/crm/auth/signin')
  }
  return routeEntry
}

function protectAll (routeEntries) {
  for (var idx in routeEntries) {
    routeEntries[idx] = protect(routeEntries[idx])
  }
  return routeEntries
}

function view (name, resolve) {
  return function (resolve) {
    require(['./views/' + name + '.vue'], resolve)
  }
}
