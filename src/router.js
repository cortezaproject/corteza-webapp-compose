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
        { path: 'pages/', name: 'public.pages', component: view('Public/Redirect'), props: true },
        {
          path: 'pages/:pageID',
          component: view('Public/Index'),
          props: true,
          children: [
            { path: '',
              name: 'public.page',
              component: view('Public/Pages/View'),
              props: true,
              children: [
                { path: 'record/:recordID/edit', name: 'public.page.record.edit', component: view('Public/Pages/Records/Edit'), props: true },
                { path: 'record/:recordID', name: 'public.page.record', component: view('Public/Pages/Records/View'), props: true },
                { path: 'record', name: 'public.page.record.create', component: view('Public/Pages/Records/Create'), props: true, meta: { newRecord: true } },
              ],
            },
          ],
        },
        {
          path: 'admin',
          name: 'admin',
          component: view('Admin/Index'),
          children: [
            // list modules (contacts, etc.)
            { path: 'modules', name: 'admin.modules', component: view('Admin/Modules/Index') },
            // create individual module structure (fields)
            { path: 'modules/edit', name: 'admin.modules.add', component: view('Admin/Modules/Edit') },
            // edit individual module structure (fields)
            { path: 'modules/:moduleID/edit', name: 'admin.modules.edit', component: view('Admin/Modules/Edit'), props: true },

            // list module records (individual contact rows,...)
            { path: 'modules/:moduleID/records', name: 'admin.modules.records', component: view('Admin/Modules/Records/Index'), props: true },
            // create an individual row (should display fields configured for the module)
            { path: 'modules/:moduleID/records/add', name: 'admin.modules.records.add', component: view('Admin/Modules/Records/Edit'), props: true },
            // edit an individual row (should display fields configured for the module)
            { path: 'modules/:moduleID/records/:recordID/edit', name: 'admin.modules.records.edit', component: view('Admin/Modules/Records/Edit'), props: true },

            { path: 'pages/', name: 'admin.pages', component: view('Admin/Pages/Index') },
            { path: 'pages/:pageID/edit', name: 'admin.pages.edit', component: view('Admin/Pages/Edit'), props: true },
            { path: 'pages/:pageID/builder', name: 'admin.pages.builder', component: view('Admin/Pages/Builder'), props: true },

            { path: 'charts', name: 'admin.charts', component: view('Admin/Charts/Index') },
            { path: 'charts/:chartID/edit', name: 'admin.charts.edit', component: view('Admin/Charts/Index'), props: true },
            { path: 'configuration', name: 'admin.configuration', component: view('Admin/Configuration/Index') },

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
    {
      path: '/crm/storybook/field-types',
      component: view('Storybook/FieldTypes'),
    },
  ]
}

export default new VueRouter({
  mode: 'history',
  routes: [
    ...crmViews(),
    ...defaultViews(),

    // When everything else fails, go to pages
    { path: '*', redirect: { name: 'public.pages' } },
  ],
})
