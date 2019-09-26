const routes = [
  {
    path: '/',
    name: '/',
    redirect: 'home',
    component: () => import('layouts/MyLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('pages/Home.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('pages/Orders.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/personal-tags',
        name: 'personal-tags',
        component: () => import('pages/PersonalTags.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/campaigns',
        name: 'campaigns',
        component: () => import('pages/Campaigns.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/poster-distribution-dashboard',
        name: 'poster-distribution-dashboard',
        component: () => import('pages/PosterDistributionDashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/poster-distribution',
        name: 'poster-distribution',
        component: () => import('pages/PosterDistribution.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clinic-posters',
        name: 'clinic-posters',
        component: () => import('pages/ClinicPosters.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clinic-poster-priorities',
        name: 'clinic-poster-priorities',
        component: () => import('pages/ClinicPosterPriorities.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/poster-models',
        name: 'poster-models',
        component: () => import('pages/PosterModels.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/sanitary-codes',
        name: 'sanitary-codes',
        component: () => import('pages/sanitaryCodes.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/profiles',
        name: 'profiles',
        component: () => import('pages/Profiles.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clinics',
        name: 'clinics',
        component: () => import('pages/Clinics.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/Auth.vue'),
    meta: { dontRecord: true },
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('pages/Auth/Login.vue')
      },
      {
        path: '/logout',
        name: 'logout',
        component: () => import('pages/Auth/Logout.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/Admin.vue'),
    meta: { dontRecord: true },
    children: [
      {
        path: '/admin-dashboard',
        name: 'admin-dashboard',
        component: () => import('pages/Admin/Dashboard.vue')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('pages/Admin/Users.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/groups',
        name: 'groups',
        component: () => import('pages/Admin/Groups.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/menus',
        name: 'menus',
        component: () => import('pages/Admin/Menus.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/menu-items',
        name: 'menu-items',
        component: () => import('pages/Admin/MenuItems.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
