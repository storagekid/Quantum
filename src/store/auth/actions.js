export function logOut (context) {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('menus')
  localStorage.removeItem('routes')
  localStorage.removeItem('lastPage')
  localStorage.removeItem('scope')
  context.commit('clearToken')
  context.commit('User/clearUser', null, { root: true })
  context.dispatch('App/resetState', null, { root: true })
  // context.commit('Scope/clearScope', null, {root: true})
}
