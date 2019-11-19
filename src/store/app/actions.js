import { LocalStorage } from 'quasar'

export function bootApp (context) {
  context.commit('Model/cleanState', null, { root: true })
  if (LocalStorage.has('settings')) context.commit('App/setSettingsFromStorage', LocalStorage.getItem('settings'), { root: true })
  if (localStorage.token && localStorage.user && localStorage.scope && localStorage.menus && localStorage.routes) {
    context.commit('Auth/setToken', LocalStorage.getItem('token'), { root: true })
    context.commit('setMenus', LocalStorage.getItem('menus'))
    context.commit('setRoutes', LocalStorage.getItem('routes'))
    let user = LocalStorage.getItem('user')
    let profile = user.profile

    context.dispatch('Model/setInitModels', profile, { root: true })
    context.commit('User/setUser', user, { root: true })
    context.commit('Scope/setScopeFromStorage', LocalStorage.getItem('scope'), { root: true })
  } else {
    context.dispatch('Auth/logOut', {}, { root: true })
    this.$router.push({ name: 'login' }).catch(err => {
      return err
      // console.log(err)
    })
  }
}
export function resetState (context) {
  context.commit('Scope/clearScope', null, { root: true })
  context.commit('Model/cleanState', null, { root: true })
}
