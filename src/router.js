import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function protect (to, from, next) {
  next(store.getters['auth/isAuthenticated'] ? true : '/auth/signin')
}

function view (name, resolve) {
  return function (resolve) {
    return require([`./views/${name}.vue`], resolve)
  }
}

function defaultViews () {
  return [
    {
      path: '/auth',
      component: view('IndexNested'),
      redirect: '/auth/signin',
      children: [
        { path: 'signin', name: 'signin', component: view('Auth/SignIn') },
        { path: 'signout', name: 'signout', component: view('Auth/SignOut') },
      ],
    },
    {
      path: '*',
      redirect: { name: 'root' },
    },
  ]
}

function crmViews () {
  return [
    {
      path: '/crm',
      component: view('IndexNested'),
      redirect: '/crm/modules',
      children: [
        // list modules (contacts, etc.)
        { path: '/crm/modules', name: 'root', component: view('Modules/Index'), beforeEnter: protect },
        // create individual module structure (fields)
        { path: '/crm/modules/edit', component: view('Modules/Edit'), beforeEnter: protect },
        // list module contents (individual contact rows,...)
        { path: '/crm/modules/:moduleID', component: view('Modules/Contents/Index'), beforeEnter: protect },
        // edit individual module structure (fields)
        { path: '/crm/modules/:moduleID/edit', component: view('Modules/Edit'), beforeEnter: protect },

        // create an individual row (should display fields configured for the module)
        { path: '/crm/modules/:moduleID/content/edit', component: view('Modules/Contents/Edit'), beforeEnter: protect },
        // list an individual row (should display the page configured for the module)
        { path: '/crm/modules/:moduleID/content/:contentID', component: view('Modules/Contents/Read'), beforeEnter: protect },
        // edit an individual row (should display fields configured for the module)
        { path: '/crm/modules/:moduleID/content/:contentID/edit', component: view('Modules/Contents/Edit'), beforeEnter: protect },

        { path: '/crm/pages', component: view('Pages/Index'), beforeEnter: protect },
        { path: '/crm/pages/:id', component: view('Pages/View'), beforeEnter: protect },
        { path: '/crm/pages/:id/edit', component: view('Pages/Edit'), beforeEnter: protect },
        { path: '/crm/builder', component: view('Builder'), beforeEnter: protect },
        // { path: '/', component: view('Public/Redirect'), beforeEnter: protect },
        { path: '/pages', component: view('Public/Redirect'), beforeEnter: protect },
        { path: '/pages/:id', component: view('Public/Pages/View'), beforeEnter: protect },
      ],
    },
  ]
}

export default new VueRouter({
  mode: 'history',
  routes: [
    ...crmViews(),
    ...defaultViews(),
  ],
})
