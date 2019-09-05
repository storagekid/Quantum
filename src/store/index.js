import Vue from 'vue'
import Vuex from 'vuex'

import App from './app'
import Auth from './auth'
import Response from './response'
import Notify from './notify'
import User from './user'
import Scope from './scope'
import Model from './model'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      App,
      Auth,
      Response,
      Notify,
      User,
      Scope,
      Model
    }
  })

  return Store
}
