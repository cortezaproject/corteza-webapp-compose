import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

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
      component: view('IndexNestedProtected'),
      redirect: '/crm/modules',
      children: [
        // list modules (contacts, etc.)
        { path: '/crm/modules', name: 'root', component: view('Modules/Index') },
        // create individual module structure (fields)
        { path: '/crm/modules/edit', component: view('Modules/Edit') },
        // list module contents (individual contact rows,...)
        { path: '/crm/modules/:moduleID', component: view('Modules/Contents/Index') },
        // edit individual module structure (fields)
        { path: '/crm/modules/:moduleID/edit', component: view('Modules/Edit') },

        // create an individual row (should display fields configured for the module)
        { path: '/crm/modules/:moduleID/content/edit', component: view('Modules/Contents/Edit') },
        // list an individual row (should display the page configured for the module)
        { path: '/crm/modules/:moduleID/content/:contentID', component: view('Modules/Contents/Read') },
        // edit an individual row (should display fields configured for the module)
        { path: '/crm/modules/:moduleID/content/:contentID/edit', component: view('Modules/Contents/Edit') },

        { path: '/crm/pages', component: view('Pages/Index') },
        { path: '/crm/pages/:id', component: view('Pages/View') },
        { path: '/crm/pages/:id/edit', component: view('Pages/Edit') },
        { path: '/crm/builder', component: view('Builder') },
        { path: '/crm/charts', component: view('Charts/Index') },
        { path: '/crm/configuration', component: view('Configuration/Index') },
        // { path: '/', component: view('Public/Redirect') },
        { path: '/pages', component: view('Public/Redirect') },
        { path: '/pages/:id', component: view('Public/Pages/View') },
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
