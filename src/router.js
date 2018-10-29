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

function defaultViews() {
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

function crmViews() {
  return [
    {
      path: '/crm',
      component: view('IndexNested'),
      children: [
        { path: '/', name: 'root', component: view('Modules/Index'), beforeEnter: protect },
        { path: '/modules', component: view('Modules/Index'), beforeEnter: protect },
        { path: '/crm/modules/:id/edit', component: view('Modules/Edit'), beforeEnter: protect },
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
