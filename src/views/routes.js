// public route builder/helper
function r (name, path, component) {
  return {
    path,
    name,
    component: () => import(`./${component}.vue`),
    props: true,
  }
}

export default [
  r('root', '', 'Namespaces'),
  r('namespace.create', '/admin/namespaces/create', 'Admin/Namespaces/Edit'),
  r('namespace.edit', '/admin/namespaces/edit/:namespaceID', 'Admin/Namespaces/Edit'),

  {
    ...r('namespace', '/ns/:slug', 'Namespace'),
    redirect: { name: 'pages' },

    children: [
      {
        ...r('pages', 'pages', 'Public/Index'),
        children: [
          {
            ...r('page', ':pageID?', 'Public/Pages/View'),

            children: [
              r('page.record.edit', 'record/:recordID/edit', 'Public/Pages/Records/Edit'),
              r('page.record', 'record/:recordID', 'Public/Pages/Records/View'),
              r('page.record.create', 'record', 'Public/Pages/Records/Create'),
            ],
          },
        ],
      },
      {
        ...r('admin', 'admin', 'Admin/Index'),

        children: [
          r('admin.modules', 'modules', 'Admin/Modules/Index'),
          r('admin.modules.edit', 'modules/:moduleID/edit', 'Admin/Modules/Edit'),
          r('admin.modules.generator', 'modules/:moduleID/generator', 'Admin/Modules/Records/Generator'),

          r('admin.pages', 'pages', 'Admin/Pages/Index'),
          r('admin.pages.edit', 'pages/:pageID/edit', 'Admin/Pages/Edit'),
          r('admin.pages.builder', 'pages/:pageID/builder', 'Admin/Pages/Builder'),

          r('admin.charts', 'charts', 'Admin/Charts/Index'),
          r('admin.charts.edit', 'charts/:chartID/edit', 'Admin/Charts/Edit'),

          r('admin.automation', 'automation', 'Admin/Automation/Index'),
          r('admin.automation.edit', 'automation/:scriptID/edit', 'Admin/Automation/Edit'),

          r('admin.configuration', 'configuration', 'Admin/Configuration/Index'),
        ],
      },

      { path: '*', redirect: { name: 'pages' } },
    ],
  },

  r('auth', '/auth', 'Auth'),

  // @todo migrate to storybook
  // {
  //   path: '/storybook',
  //   redirect: 'field-types',
  //   component: view('Admin/Index'),
  //   children: [
  //     { path: 'field-types', name: 'storybook.field-types', component: view('Storybook/FieldTypes') },
  //   ],
  // },

  // When everything else fails, go to namespaces
  { path: '*', redirect: { name: 'root' } },
]
