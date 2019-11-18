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
        path: '/marketing-user-home',
        name: 'MarketingUserHome',
        component: () => import('pages/Homes/MarketingUserHome.vue'),
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
        path: '/legals',
        name: 'legals',
        component: () => import('pages/Legals.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/promotions',
        name: 'promotions',
        component: () => import('pages/Promotions.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/claims',
        name: 'claims',
        component: () => import('pages/Claims.vue'),
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
        path: '/mailings',
        name: 'mailings',
        component: () => import('pages/Mailings.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/mailing-designs',
        name: 'mailing-designs',
        component: () => import('pages/MailingDesigns.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clinic-mailings',
        name: 'clinic-mailings',
        component: () => import('pages/ClinicMailings.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/profiles',
        name: 'profiles',
        component: () => import('pages/Profiles.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/providers',
        name: 'providers',
        component: () => import('pages/Providers.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/products',
        name: 'products',
        component: () => import('pages/Products.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/services',
        name: 'services',
        component: () => import('pages/Services.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/clinics',
        name: 'clinics',
        component: () => import('pages/Clinics.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/stands',
        name: 'stands',
        component: () => import('pages/Stands.vue'),
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
        path: '/scope-countries',
        name: 'scope-countries',
        component: () => import('pages/Admin/Scope/Countries.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/scope-states',
        name: 'scope-states',
        component: () => import('pages/Admin/Scope/States.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/scope-counties',
        name: 'scope-counties',
        component: () => import('pages/Admin/Scope/Counties.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/scope-clinics',
        name: 'scope-clinics',
        component: () => import('pages/Admin/Scope/Clinics.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/scope-stores',
        name: 'scope-stores',
        component: () => import('pages/Admin/Scope/Stores.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/scope-companies',
        name: 'scope-companies',
        component: () => import('pages/Admin/Scope/Companies.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/scope-languages',
        name: 'scope-languages',
        component: () => import('pages/Admin/Scope/Languages.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/scope-currencies',
        name: 'scope-currencies',
        component: () => import('pages/Admin/Scope/Currencies.vue'),
        meta: { requiresAuth: true }
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
