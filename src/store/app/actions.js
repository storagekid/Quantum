export function bootApp (context) {
  context.commit('Model/cleanState', null, { root: true })
  if (localStorage.settings) context.commit('App/setSettingsFromStorage', JSON.parse(localStorage.settings), { root: true })
  if (localStorage.token && localStorage.user && localStorage.scope && localStorage.menus && localStorage.routes) {
    context.commit('Auth/setToken', localStorage.token, { root: true })
    context.commit('setMenus', JSON.parse(localStorage.menus))
    context.commit('setRoutes', JSON.parse(localStorage.routes))
    let user = JSON.parse(localStorage.user)
    let profile = user.profile

    context.dispatch('Model/setInitModels', profile, { root: true })
    context.commit('User/setUser', JSON.parse(localStorage.user), { root: true })
    context.commit('Scope/setScopeFromStorage', JSON.parse(localStorage.scope), { root: true })
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
