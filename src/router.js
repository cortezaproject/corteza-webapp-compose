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
  ]
}

function crmViews () {
  return [
    {
      path: '/crm',
      name: 'root',
      component: view('IndexNestedProtected'),
      redirect: 'pages',
      children: [
        {
          path: 'pages',
          component: view('IndexNestedProtected'),
          children: [
            { path: '', name: 'public.pages', component: view('Public/Redirect') },
            { path: ':id', name: 'public.page', component: view('Public/Pages/View') },

          ],
        },
        {
          path: 'admin',
          name: 'admin',
          component: view('IndexNestedProtected'),
          children: [
            // list modules (contacts, etc.)
            { path: 'modules', name: 'admin.modules', component: view('Modules/Index') },
            // create individual module structure (fields)
            { path: 'modules/edit', name: 'admin.modules.add', component: view('Modules/Edit') },
            // list module contents (individual contact rows,...)
            { path: 'modules/:moduleID', name: 'admin.modules.view', component: view('Modules/Contents/Index') },
            // edit individual module structure (fields)
            { path: 'modules/:moduleID/edit', name: 'admin.modules.edit', component: view('Modules/Edit') },

            // create an individual row (should display fields configured for the module)
            { path: 'modules/:moduleID/content/add', name: 'admin.modules.content.add', component: view('Modules/Contents/Edit') },
            // list an individual row (should display the page configured for the module)
            { path: 'modules/:moduleID/content/:contentID', name: 'admin.modules.content.view', component: view('Modules/Contents/Read') },
            // edit an individual row (should display fields configured for the module)
            { path: 'modules/:moduleID/content/:contentID/edit', name: 'admin.modules.content.edit', component: view('Modules/Contents/Edit') },

            { path: 'pages/', name: 'admin.pages', component: view('Pages/Index') },
            { path: 'pages/:pageID', name: 'admin.pages.view', component: view('Pages/View') },
            { path: 'pages/:pageID/edit', name: 'admin.pages.edit', component: view('Pages/Edit') },

            { path: 'builder', name: 'admin.builder', component: view('Builder') },
            { path: 'charts', name: 'admin.charts', component: view('Charts/Index') },
            { path: 'charts/:chartID/edit', name: 'admin.charts.edit', component: view('Charts/Index') },
            { path: 'configuration', name: 'admin.configuration', component: view('Configuration/Index') },

            { path: 'temp/fieldblock', component: view('Temp/Fieldblock') },
            { path: 'temp/fieldeditblock', component: view('Temp/Fieldeditblock') },
            { path: 'temp/normaltableblock', component: view('Temp/Normaltableblock') },
            { path: 'temp/relatedtableblock', component: view('Temp/Relatedtableblock') },
            { path: 'temp/textblock', component: view('Temp/Textblock') },
            { path: 'temp/linechartblock', component: view('Temp/Linechartblock') },
            { path: 'temp/piechartblock', component: view('Temp/Piechartblock') },
            { path: 'temp/barchartblock', component: view('Temp/Barchartblock') },
            { path: 'temp/donutchartblock', component: view('Temp/Donutchartblock') },
            { path: 'temp/socialblock', component: view('Temp/Socialblock') },
          ],
        },
      ],
    },
  ]
}

export default new VueRouter({
  mode: 'history',
  routes: [
    ...crmViews(),
    ...defaultViews(),

    // When everything else failes, go to pages
    { path: '*', redirect: { name: 'public.pages' } },
  ],
})
