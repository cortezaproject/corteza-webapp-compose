import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// public route builder/helper
function pub (name, path, component) {
  return {
    path,
    name,
    component: () => import(`./views/Public/${component}.vue`),
    props: true,
  }
}

// admin route builder/helper
//
// we're not auto-prefixing name because we want to
// have it in one string for easier searching
function adm (name, path, component) {
  return {
    path,
    name,
    component: () => import(`./views/Admin/${component}.vue`),
    props: true,
  }
}

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '', name: 'root', component: view('Namespaces') },

    { path: '/auth', name: 'auth', component: view('Auth') },

    {
      path: '/ns/:slug/',
      name: 'namespace',
      component: view('Namespace'),
      props: true,

      children: [
        {
          ...pub('pages', 'pages', 'Index'),
          children: [
            {
              ...pub('page', ':pageID?', 'Pages/View'),

              children: [
                pub('page.record.edit', 'record/:recordID/edit', 'Pages/Records/Edit'),
                pub('page.record', 'record/:recordID', 'Pages/Records/View'),
                pub('page.record.create', 'record', 'Pages/Records/Create'),
              ],
            },
          ],
        },
        {
          ...adm('admin', 'admin', 'Index'),

          children: [
            adm('admin.modules', 'modules', 'Modules/Index'),
            adm('admin.modules.edit', 'modules/:moduleID/edit', 'Modules/Edit'),
            adm('admin.modules.generator', 'modules/:moduleID/generator', 'Modules/Records/Generator'),

            adm('admin.pages', 'pages', 'Pages/Index'),
            adm('admin.pages.edit', 'pages/:pageID/edit', 'Pages/Edit'),
            adm('admin.pages.builder', 'pages/:pageID/builder', 'Pages/Builder'),

            adm('admin.charts', 'charts', 'Charts/Index'),
            adm('admin.charts.edit', 'charts/:chartID/edit', 'Charts/Edit'),

            adm('admin.automation', 'automation', 'Automation/Index'),
            adm('admin.automation.edit', 'automation/:triggerID/edit', 'Automation/Edit'),

            adm('admin.configuration', 'configuration', 'Configuration/Index'),
          ],
        },
        { path: '*', redirect: { name: 'pages' } },
      ],
    },

    {
      path: '/storybook',
      redirect: 'field-types',
      component: view('Admin/Index'),
      children: [
        { path: 'field-types', name: 'storybook.field-types', component: view('Storybook/FieldTypes') },
      ],
    },

    // When everything else fails, go to namespaces
    { path: '*', redirect: { name: 'root' } },
  ],
})

function view (name) {
  return () => import(`./views/${name}.vue`)
}
