import Vue from 'vue'
import VueRouter from 'vue-router'
import { LocalStorage } from 'quasar'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (!localStorage.token) {
        // console.log('Router TO Login')
        next({
          name: 'login',
          query: { redirect: to.fullPath }
        })
      } else if (to.name === 'home') next()
      else if (!store.state.App.routes.length) {
        // console.log('Router TO Included in LocalStorage')
        // console.log(JSON.parse(localStorage.routes).includes(to.name))
        let routes = LocalStorage.getItem('routes')
        if (!routes.includes(to.name)) {
          next({
            name: 'home'
          })
        }
        next()
      } else {
        // console.log('Router TO Included')
        // console.log(store.state.App.routes)
        // console.log(to.name)
        // console.log(store.state.App.routes.includes(to.name))
        if (!store.state.App.routes.includes(to.name) && to.name !== 'logout') {
          // console.log('WTF')
          let name
          if (localStorage.settings) {
            name = LocalStorage.getItem('settings')['home']
            if (!store.state.App.routes.includes(name)) name = store.state.App.routes[0]
          } else {
            name = store.state.App.routes[0]
          }
          // console.log('NAME: ' + name)
          next({
            name: name
          })
        } else {
          // console.log('THERE')
          if (to.matched[0].path !== '/auth') {
            // localStorage.setItem('lastPage', to.name)
            LocalStorage.set('lastPage', to.name)
          }
          next()
        }
      }
    } else {
      // console.log('Last NEXT')
      next() // make sure to always call next()!
    }
  })
  return Router
}
