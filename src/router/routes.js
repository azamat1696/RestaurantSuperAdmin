
const routes = [
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { requiresAuth : false },
    name: 'loginRoot',
    children: [
      { path: 'login', name:'login',component: () => import('pages/Auth/Login.vue')},
      { path: 'register', name:'register',component: () => import('pages/Auth/Register.vue')},
      { path: 'forgot-password', name:'ForgotPassword',component: () => import('pages/Auth/ForgotPassword.vue')},
      { path: 'reset-password/token/:token', name:'resetPassword', component: () => import('pages/Auth/ResetPassword.vue')}
    ]
  },
  {
    path: '/',
    component: () => import('layouts/AppLayout.vue'),
    meta: { requiresAuth : true },
    children: [
      { path: '', name: 'root', component: () => import('pages/IndexPage.vue') },
    ]

  },
  {
    path: '/settings',
    component: () => import('layouts/SettingsLayout.vue'),
    meta: { requiresAuth : true },
    children: [
      { path: '/settings/cities', name: 'cities', component: () => import('pages/Settings/Cities.vue') },
      { path: '/settings/districts', name: 'districts', component: () => import('pages/Settings/Districts.vue') },
      { path: '/settings/restaurant-types', name: 'restaurantTypes', component: () => import('pages/Settings/RestaurantTypes.vue') },
      { path: '/settings/sliders', name: 'Slider', component: () => import('pages/Settings/Slider.vue') },
    ]

  },
  {
    path: '/place-events',
    component: () => import('layouts/EventAndPlaces.vue'),
    meta: { requiresAuth : true },
    children: [
      { path: '/place-events/places', name: 'Restaurants', component: () => import('pages/Restaurants/Places.vue') },
      { path: '/place-events/events', name: 'events', component: () => import('pages/Events/Events.vue') },
      { path: '/place-events/rest-users', name: 'RestaurantUsers', component: () => import('pages/RestaurantUsers/RestaurantUser.vue') },
      { path: '/place-events/customers', name: 'Customers', component: () => import('pages/Customers/Customers.vue') },
      { path: '/place-events/super-user', name: 'SuperUser', component: () => import('pages/SuperUser/SuperUser.vue') },
      { path: 'reservations', name: 'Reservations', component: () => import('pages/Reservations/Reservations.vue') },


    ]

  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  }
]

export default routes
